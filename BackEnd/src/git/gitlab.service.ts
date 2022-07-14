import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GitlabService {
    // a wrapper for set timeout,
    // reference can be found in
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise
    private async sleep(time: number): Promise<void> {
        return new Promise((resolve) =>
            setTimeout(() => resolve(void 0), time),
        );
    }
    private sleepLimit = 10;
    private sleepTime = 500;
    async fetchMergeRequests(
        projectId: number,
        auth: string,
        url: string,
        page = 1,
    ) {
        //Logger.debug(url);
        const fullUrl = new URL(
            `/api/v4/projects/${projectId}/merge_requests`,
            url,
        ).toString();
        //Logger.debug(fullUrl);
        const res = await axios.get(fullUrl, {
            params: {
                page: page,
                per_page: 100,
            },
            headers: {
                'PRIVATE-TOKEN': auth,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return res.data;
    }

    async fetchAllMergeRequests(projectId: number, auth: string, url: string) {
        let res = [];
        for (let i = 1; ; i++) {
            const page = (await this.fetchMergeRequests(
                projectId,
                auth,
                url,
                i,
            )) as Array<any>;
            //Logger.debug(page);
            if (page.length === 0) break;
            res = res.concat(page);
            if (i % this.sleepLimit === 0) await this.sleep(this.sleepTime);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return res;
    }

    async fetchIssues(
        projectId: number,
        auth: string,
        url: string,
        page: number,
        label: string,
    ) {
        const fullUrl = new URL(
            `/api/v4/projects/${projectId}/issues`,
            url,
        ).toString();
        const res = await axios.get(fullUrl, {
            params: {
                page: page,
                per_page: 100,
                labels: label,
            },
            headers: {
                'PRIVATE-TOKEN': auth,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return res.data;
    }
    async fetchAllIssues(
        projectId: number,
        auth: string,
        url: string,
        label = '',
    ) {
        let res = [];
        for (let i = 1; ; i++) {
            const page = (await this.fetchIssues(
                projectId,
                auth,
                url,
                i,
                label,
            )) as Array<any>;
            //Logger.debug(page);
            if (page.length === 0) break;
            res = res.concat(page);
            if (i % this.sleepLimit === 0) await this.sleep(this.sleepTime);
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return res;
    }

    async fetchIssueClosedBy(
        projectId: number,
        auth: string,
        url: string,
        issueId: number,
    ) {
        const fullUrl = new URL(
            `/api/v4/projects/${projectId}/issues/${issueId}/closed_by`,
            url,
        ).toString();
        const res = await axios.get(fullUrl, {
            headers: {
                'PRIVATE-TOKEN': auth,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return res.data;
    }
}
