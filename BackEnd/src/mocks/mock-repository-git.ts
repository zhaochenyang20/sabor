import { Issue } from 'src/git/entities/issue.entity';
import { MergeRequest } from '../git/entities/mergeRequest.entity';
import { mockFunctionalRequirement, MockRepository } from './mock-repository';

export function mockMergeRequestRepository(
    mergeRequestRepository: MockRepository,
) {
    mergeRequestRepository.findOne.mockImplementation(
        ({
            projectId,
            mergeRequestId,
        }: {
            projectId?: number;
            mergeRequestId?: number;
        }) => {
            if (projectId === 1 && mergeRequestId === 1) {
                return { ...mockMergeRequest };
            }
            if (projectId === 1 && mergeRequestId === 2) {
                return { ...mockMergeRequest2 };
            }
            return null;
        },
    );
    mergeRequestRepository.create.mockImplementation((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
            sid: 1,
            ...data,
        };
    });
    mergeRequestRepository.save.mockImplementation((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    });
    mergeRequestRepository.find.mockImplementation(() => {
        return [];
    });
    mergeRequestRepository.findByIds.mockImplementation(() => {
        return [mockMergeRequest];
    });
}

export function mockIssueRepository(issueRepository: MockRepository) {
    issueRepository.findOne.mockImplementation(
        ({ projectId, issueId }: { projectId?: number; issueId?: number }) => {
            if (projectId === 1 && issueId === 1) {
                return { ...mockIssue };
            }
            if (projectId === 1 && issueId === 2) {
                return { ...mockIssue2 };
            }
            return null;
        },
    );
    issueRepository.create.mockImplementation((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return {
            sid: 1,
            ...data,
        };
    });
    issueRepository.save.mockImplementation((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return data;
    });
    issueRepository.find.mockImplementation(() => {
        return [];
    });
}

export const mockMergeRequest: MergeRequest = {
    sid: 1,
    projectId: 1,
    mergeRequestId: 1,
    relatedFunctionalRequirement: [mockFunctionalRequirement],
    title: 'test1',
    description: 'test1-desc',
    relatedIssue: [
        {
            sid: 2,
            projectId: 1,
            issueId: 2,
            title: 'testIssue2',
            description: 'test-issue-2-desc',
            state: 'closed',
            relatedMergeRequest: [],
            closeByLastAccess: new Date(0),
        },
    ],
};

export const mockMergeRequest2: MergeRequest = {
    sid: 2,
    projectId: 1,
    mergeRequestId: 2,
    relatedFunctionalRequirement: [],
    title: 'test2',
    description: 'test2-desc',
    relatedIssue: [],
};

export const mockIssue: Issue = {
    sid: 1,
    projectId: 1,
    issueId: 1,
    title: 'testIssue1',
    description: 'test-issue-1-desc',
    state: 'open',
    relatedMergeRequest: [],
    closeByLastAccess: new Date(0),
};

export const mockIssue2: Issue = {
    sid: 2,
    projectId: 1,
    issueId: 2,
    title: 'testIssue2',
    description: 'test-issue-2-desc',
    state: 'closed',
    relatedMergeRequest: [mockMergeRequest],
    closeByLastAccess: new Date(0),
};
