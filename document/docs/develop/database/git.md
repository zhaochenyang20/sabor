title: 仓库管理系统

## 合并请求 MergeRequest
| 字段 | 类型 | Typeorm 装饰器 | 属性 | 说明 |
| ------  | --- | --- | --- | --- |
| `sid` | `number` | `PrimaryGeneratedColumn` | `PRIMARY KEY`, `Unique` | Merge Request 在数据库中的 ID |
| `projectId` | `number` | `Column` | | 所属项目 ID |
| `mergeRequestId` | `number` | `Column` |  | Merge Request 在 Git 仓库中的 ID |
| `title` | `string` | `Column` | | Merge Request 标题 |
| `description` | `string` | `Column` | | Merge Request 内容 |
| `relatedFunctionalRequirement` | [FunctionalRequirement](../project/#functionalrequirement)[] | `ManyToMany` | | 关联的功能需求 |
| `relatedIssue` | [Issue](../git/#issue)[] | `ManyToMany` | | 关联的 Issue |

## 缺陷 Issue
| 字段 | 类型 | Typeorm 装饰器 | 属性 | 说明 |
| ------  | --- | --- | --- | --- |
| `id` | `number` | `PrimaryGeneratedColumn` | `PRIMARY KEY`, `Unique` | Issue ID |
| `name` | `string` | `Column` | | Issue 标题 |
| `description` | `string` | `Column` |  | Issue 正文 |
| `deadline` | `Date` | `Column` | | Issue 截止时间 |
| `state` | `number` | `Column` | | Issue 状态（opened/closed） |
| `relatedMergeRequest` | [MergeRequest](../git/#mergerequest)[] | `ManyToMany` | | 关联的 Merge Request |
| `closeByLastAccess` | `Date` | `Column` | | `relatedMergeRequest` 上一次更新时间 |
| `assignee` | `string` | `Column` | `Nullable` | 分配任务的人的 Gitlab 用户名, null 表示没有 |
| `createTime` | `Date` | `Column` | | Issue 创建时间 |
| `closeTime` | `Date` | `Column` | | Issue 关闭时间 |
