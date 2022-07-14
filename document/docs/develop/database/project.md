title: 项目管理系统

## 项目 Project
| 字段 | 类型 | Typeorm 装饰器 | 属性 | 说明 |
| ------  | --- | --- | --- | --- |
| `id` | `number` | `PrimaryGeneratedColumn` | `PRIMARY KEY`, `Unique` | 项目 ID |
| `name` | `string` | `Column` | | 项目名称 |
| `description` | `string` | `Column` |  | 项目说明 |
| `manager` | [User](../user/#user) | `ManyToOne` | `FOREIGN KEY` | 项目管理员 |
| `systemEngineers` | [User](../user/#user)[] | `ManyToMany` | | 项目系统工程师 |
| `developmentEngineers` | [User](../user/#user)[] | `ManyToMany` | | 项目开发工程师 |
| `qualityAssuranceEngineers` | [User](../user/#user)[] | `ManyToMany` | | 项目质量保障工程师 |
| `originalRequirements` | [OriginalRequirement](../project/#originalrequirement)[] | `OneToMany` | | 原始需求 |
| `systemServices` | [SystemService](../project/#systemservice)[] | `OneToMany` | | 系统服务 |
| `iterations` | [Iteration](../project/#iteration)[] | `OneToMany` | | 迭代 |
| `createDate` | `Date` | `CreateDateColumn` | `Auto-generated` | 创建时间 |
| `updateDate` | `Date` | `UpdateDateColumn` | `Auto-generated` | 更新时间 |
| `hasGitRepo` | `boolean` | `Column` | | 是否绑定 Git 仓库，默认为 false |
| `gitlabUrl` | `string` | `Column` | | Gitlab 仓库的 url，默认为空字符串 |
| `gitlabProjId` | `number` | `Column` | | Gitlab 仓库的 ID，默认为 0 |
| `gitAccessToken` | `string` | `Column` | | 仓库 Access Token，默认为空字符串 |
| `mergeRequestLastAccess` | `Date` | `Column` | | 上一次获取 Merge Request 的时间，默认为时间戳为 0 的时间 |
| `issueLastAccess` | `Date` | `Column` | | 上一次获取 Issue 的时间，默认为时间戳为 0 的时间 |
| `gitIssueTag` | `string` | `Column` | | 仓库订阅 Issue Tag，默认为空字符串 |

## 原始需求 OriginalRequirement
| 字段 | 类型 | Typeorm 装饰器 | 属性 | 说明 |
| ------  | --- | --- | --- | --- |
| `id` | `number` | `PrimaryGeneratedColumn` | `PRIMARY KEY`, `Unique` | 原始需求 ID |
| `name` | `string` | `Column` | `Unique` | 原始需求名称 |
| `description` | `string` | `Column` |  | 原始需求描述 |
| `creatorUsername` | `string` | `Column` | | 创建者名称 |
| `project` | [Project](../project/#project) | `ManyToOne` | `FOREIGN KEY` | 所属项目 |
| `functionalRequirements` | [FunctionalRequirement](../project/#functionalrequirement)[] | `OneToMany` | | 功能需求 |
| `createDate` | `Date` | `CreateDateColumn` | `Auto-generated` | 创建时间 |
| `updateDate` | `Date` | `UpdateDateColumn` | `Auto-generated` | 更新时间 |

## 系统服务 SystemService
| 字段 | 类型 | Typeorm 装饰器 | 属性 | 说明 |
| ------  | --- | --- | --- | --- |
| `id` | `number` | `PrimaryGeneratedColumn` | `PRIMARY KEY`, `Unique` | 系统服务 ID |
| `name` | `string` | `Column` | `Unique` | 系统服务名称 |
| `description` | `string` | `Column` |  | 系统服务描述 |
| `project` | [Project](../project/#project) | `ManyToOne` | `FOREIGN KEY` | 所属项目 |
| `functionalRequirements` | [FunctionalRequirement](../project/#functionalrequirement)[] | `OneToMany` | | 功能需求 |
| `createDate` | `Date` | `CreateDateColumn` | `Auto-generated` | 创建时间 |
| `updateDate` | `Date` | `UpdateDateColumn` | `Auto-generated` | 更新时间 |

## 迭代 Iteration
| 字段 | 类型 | Typeorm 装饰器 | 属性 | 说明 |
| ------  | --- | --- | --- | --- |
| `id` | `number` | `PrimaryGeneratedColumn` | `PRIMARY KEY`, `Unique` | 迭代 ID |
| `name` | `string` | `Column` | `Unique` | 迭代名称 |
| `description` | `string` | `Column` |  | 迭代描述 |
| `project` | [Project](../project/#project) | `ManyToOne` | `FOREIGN KEY` | 所属项目 |
| `deadline` | `Date` | `Column` | | 迭代截止时间 |
| `directorUsername` | `string` | `Column` | | 迭代负责人名称 |
| `functionalRequirements` | [FunctionalRequirement](../project/#functionalrequirement)[] | `OneToMany` | | 功能需求 |
| `createDate` | `Date` | `CreateDateColumn` | `Auto-generated` | 创建时间 |
| `updateDate` | `Date` | `UpdateDateColumn` | `Auto-generated` | 更新时间 |

## 功能需求 FunctionalRequirement
| 字段 | 类型 | Typeorm 装饰器 | 属性 | 说明 |
| ------  | --- | --- | --- | --- |
| `id` | `number` | `PrimaryGeneratedColumn` | `PRIMARY KEY`, `Unique` | 功能需求 ID |
| `name` | `string` | `Column` | `Unique` | 功能需求名称 |
| `description` | `string` | `Column` |  | 功能需求描述 |
| `state` | `number` | `Column` | | 功能需求状态，1~3 分别代表初始化、开发中、已交付 |
| `originalRequirement` | [OriginalRequirement](../project/#originalrequirement) | `ManyToOne` | `FOREIGN KEY` | 所属原始需求 |
| `distributorId` | `number` | `Column` | | 创建者 ID |
| `developerId` | `number` | `Column` | | 开发者 ID |
| `projectId` | `number` | `Column` | | 所属项目 ID |
| `systemService` | [SystemService](../project/#systemservice) | `ManyToOne` | `FOREIGN KEY` | 所属系统服务 |
| `deliveryIteration` | [Iteration](../project/#iteration) | `ManyToOne` | `FOREIGN KEY` | 所属迭代 |
| `relatedMergeRequest` | [MergeRequest](../git/#mergerequest)[] | `ManyToMany` | | 关联的合并请求 |
| `createDate` | `Date` | `CreateDateColumn` | `Auto-generated` | 创建时间 |
| `updateDate` | `Date` | `UpdateDateColumn` | `Auto-generated` | 更新时间 |