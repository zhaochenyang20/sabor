!!! attention "阅读说明"

    在阅读以下内容前，请确保您已经仔细阅读了[说明部分](index.md)的相关内容。

本系统中，支持使用 gitlab 作为辅助的版本控制和代码仓库管理系统。

!!! note "关于 gitlab 的一些说明"

    由于 gitlab 可以在不同的网站部署，所以需要 gitlab URL，如 `https://gitlab.secoder.net/`。

    gitlab 仓库在这里是通过仓库编号来指定的，这可以在仓库的主页看到。

    如果该仓库不是公开（public）项目的话，还需要提供 access token（有读取 api 的权限），详情请参考 [gitlab 文档](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)。
    
    为了获取某一特定类型的 issue，可以订阅某一 tag，即只拉取打上这一个 tag 的 Issue.
    


## GET `/api/projects/:id/git/get-info`

需要登录，需要项目管理员权限。

### 功能说明

获取项目 git 仓库信息。

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id，应为非负整数 |


### 返回值

+ code: 200
+ data:
    - `hasGitRepo`: `boolean`, 是否有 git repo 信息。
    - `isGitLab`: `boolean`, 永远为 true
    - `detail`: `object`, 如果不存在 git repo 则为空，否则为：
        + `gitlabUrl`: `string`, gitLab 地址
        + `gitlabProjId`: `number`, gitLab **项目ID**
        + `gitAccessToken`: `string`, gitLab access token
        + `gitIssueTag`: `string`, 订阅的 issue tag，空代表所有 tag

## POST `/api/projects/:id/git/set-info`

需要登录，需要项目管理员权限

### 功能说明

修改项目 git 仓库信息

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` (path) | `number` | 项目 id |
| `url` | `string` | git 仓库网址，特别地，如果为空表示删除 git 仓库信息。**需要带协议(http/https)**，如 `https://gitlab.secoder.net` |
| `id` (body) | `number` | 仓库 Id |
| `token` | `string` | gitlab access token |
| `issueTag?` | `string` | 仅拉取此类 tag 的 issue, 留空表示拉取所有 issue |

### 返回

如果没有 MR 与功能需求关联，则会修改仓库信息，成功时返回：

+ code: 200
+ data:
    - code: 0
    - info: 成功信息
    
    
否则如果存在 MR 与功能需求关联，则不允许修改仓库信息（URL/projectID，但允许修改 token），返回

+ code: 200
+ data:
    - code: 1
    - info: 说明信息
    
如果设置成功，但是无法访问对应的 gitlab 仓库（如有），则返回：

+ code: 200
+ data:
    - code: 2
    - info: 说明信息

## GET `/api/projects/:id/git/get-merge-request`

需要登录，需要项目管理员或质量保证工程师权限

### 功能说明

获取该项目关联仓库的所有 Merge Request(MR).

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id |

### 返回

+ code: 200
+ data:
    + `hasGitRepo`: `boolean`, 是否存在 git 仓库
    + `networkFailed`：已废弃
    + `content`: 为一数组，其中每一项包含
        - id: `number`, MR id
        - title: `string`， 标题
        - content: `string`，正文
        - relatedFunctionalRequirement: `object[]`，每一项表示 MR 关联的功能需求，包括
            + id: 对应功能需求的 id
            + name: 功能需求名称  
            + description: 功能需求描述  
        - assignee: `string | null`, 分配任务的人的 gitlab 用户名, `null` 表示没有

## GET `/api/projects/:id/git/get-issue`

需要登录，需要项目管理员或质量保证工程师权限

### 功能说明

获取该项目关联仓库的所有 Issue.

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id |

### 返回

+ code: 200
+ data:
    + `hasGitRepo`: `boolean`, 是否存在 git 仓库
    + `networkFailed`：已废弃
    + `content`: 为一数组，其中每一项包含
        - id: `number`, Issue id
        - title: `string`， 标题
        - content: `string`，正文
        - state: `string`, 表示 issue 状态（`opened`/`closed`）
        - assignee: `string | null`, 分配任务的人的 gitlab 用户名, `null` 表示没有
        - createTime: `number | null`, issue 创建时间
        - closeTime: `number | null`, issue close 时间

!!! note "缓存"

    MR 和 Issue 的拉取均存在缓存，即获取的内容可能不是远程 git 仓库的实时内容，而是服务器端缓存之后的内容。目前缓存期限为 1h.

    缓存逻辑如下：每次 git 仓库配置更新是开始在后台缓存，如果该次查询距上次缓存超过 1h，则触发一次缓存更新（但是本次请求依然返回缓存内容），如果这次更新成功，则会写入数据库，否则，将允许在 5 分钟后重试（依然需要通过一次查询来触发）。特别地，在仓库信息更新后，也会进行一次缓存更新。

## POST `/api/projects/:id/git/attach-merge-req-with-func-req`

需要登录，需要项目管理员或质量保证工程师角色。

### 功能说明

将 功能需求 和 MR 关联。

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id |
| `addItem?` | `Array<Detail>` | 增加的关联信息 |
| `delItem?` | `Array<Detail>` | 删除的关联信息 |

其中 `Detail` 包含

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `functionalRequestId` | `number` | 功能需求 ID |
| `mergeRequestId` | `number` | MR ID |

### 返回

+ code: 200
+ data: 成功信息

### 注意事项

1. `addItem` 和 `delItem` 只能出现一个，如果二者均出现，将只处理 `addItem`.
2. 发生下列情况的时候，将会自动跳过这一项请求，而不会报错。
    - 功能需求不存在或非本项目功能需求
    - MR 不存在
    - 功能需求和 MR 已经关联（`addItem`）或未关联（`delItem`）。

## GET `/api/projects/:id/git/get-merge-req-of-func-req/:func`

需要登录，需要项目管理员或 质量保证工程师 身份

### 功能说明

获取与功能需求相关联的 MR。

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id |
| `func` | `number` | 功能需求 id |

### 返回

正常情况

+ code: 200
+ data: 数组，每一项为：
    - id: MR id
    - title: MR 标题
    - content: MR 内容


当功能需求不存在或不属于该项目时

+ code: 400 
+ data:
    - code: 1
    - info: 错误信息

## GET `/api/projects/:id/git/get-issue-closed-by/:issue`

需要登录，需要项目管理员或 质量保证工程师 身份。

### 功能说明

  获取 Issue 在哪些 MR 中得到解决。
  
  「解决」的判定标注为，在 MR 信息中使用 `close #xxx` 语句将 issue 关闭。

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id |
| `issue` | `number` | Issue id |


### 返回

正常情况

+ code: 200
+ data: 数组，每一项为：
    - id: `number`, MR id
    - title: `string`, MR 标题
  - content: MR 内容

当 Issue 不存在时

+ code: 404
+ data: 错误信息

!!! note "缓存"

    这一部分内容采用同样采用缓存机制，具体细节如下：
    
    + 这一部分只拉取 MR 信息，因此新的 MR 会被发现并记录到缓存中
    + Issue 信息不会更新，因此如果在缓存期内新建了 Issue，那么将依然返回 400
    + 每一个 Issue 的关联 MR 信息将单独计算缓存期。

## GET /api/projects/:id/git/get-mr-suggest/:mr 

需要登录，需要项目管理员或 质量保证工程师 身份。

### 功能说明

提供 MR 与 SR 关联的建议。**不会实际操作数据库**。匹配逻辑为 SR 的名称在 MR 的标题或正文中出现。

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id |
| `mr` | `number` | MR 编号 |

### 返回

+ code: 200
+ data: 数组，其中每项包括：
    - `id`: `number`, SR 的 id
    - `name`：`string`, SR 的标题
    - `description`: `string`, SR 的内容



## GET /api/projects/:id/git/get-issue-caused-by-sr/:sr 

需要登录，需要项目管理员或 质量保证工程师 身份。

### 功能说明

  提供某个 SR 的缺陷信息。标准为在 issue 内提到了这个 SR 的名称。

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id |
| `sr` | `number` | SR 编号 |

### 返回

正常情况


+ code: 200
+ data: 数组，其中每项为一个 Issue 信息，格式同 [get-issue](#get-apiprojectsidgitget-issue)

功能需求未找到或不是该项目的功能需求

+ code: 404
+ data: 错误信息

## GET /api/projects/:id/git/get-issue-stat

需要登录，需要项目管理员或 质量保证工程师 身份。

### 功能说明

获取按照工程师的缺陷解决统计

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id |

### 返回

+ code: 200
+ data: 数组，其中每项包括
    - name: `string` gitlab 用户名
    - time：`number []` 每个 issue 的解决时间，单位 ms
    - openIssue: `number`, 尚未完成 issue 数量

## GET /api/projects/:id/git/get-merge-request-stat

需要登录，需要项目管理员或 质量保证工程师 身份。

### 功能说明

  获取各个用户 MR 数量统计

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `id` | `number` | 项目 id |

### 返回

+ code: 200
+ data: 数组，其中每项包括
    - name: `string` gitlab 用户名
    - mergeRequest: `number` 用户 mergeRequest 数量
