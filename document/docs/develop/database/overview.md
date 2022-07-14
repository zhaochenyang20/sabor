title: 数据库设计

## 数据库选型

我们为开发和实际生产环境所使用的数据库均为 PostgreSQL 11.5，两个数据库功能一致但相互隔离，保证了测试的可靠性和有效性。我们使用 Typeorm 作为对象关系映射（ORM）框架，从而可以轻松管理 Nestjs 的实体（Entity）成员与 PostgreSQL 的表项的对应关系。

## 数据表一览

| 表名 | Nestjs 实体类名 | 说明 | 归属模块 |
| ------  | --- | --- | --- |
| `user` | [User](../user/#user) | 用户 | `用户管理系统` |
| `project` | [Project](../project/#project) | 项目 | `项目管理系统` |
| `original_requirement` | [OriginalRequirement](../project/#originalrequirement) | 原始需求 | `项目管理系统` |
| `system_service` | [SystemService](../project/#systemservice) | 系统服务 | `项目管理系统` |
| `iteration` | [Iteration](../project/#iteration) | 迭代 | `项目管理系统` |
| `functional_requirement` | [FunctionalRequirement](../project/#functionalrequirement) | 功能需求 | `项目管理系统` |
| `merge_request` | [MergeRequest](../git/#mergerequest) | 合并请求 | `仓库管理系统` |
| `issue` | [Issue](../git/#issue) | 缺陷 | `仓库管理系统` |

!!! info 

    关于各个模块的功能介绍见[模块设计](../design/module.md)。

## 数据类型说明

由于我们使用了 Typeorm 来管理实体与数据库表项的对应关系，因此创建实体时只需指定其 Typescript 变量类型和 Typeorm 装饰器，便可以自动在数据库中生成相应表项（可指定表项类型，不指定则设为默认类型，本项目中均采用默认类型）。下面列出了项目中使用到的 Typescript 变量类型和 Typeorm 装饰器与 PostgreSQL 默认表项类型的映射关系。

| Typescript 变量类型 | Typeorm 装饰器 | PostgreSQL 默认表项类型 |
| ------  | --- | --- |
| `number` | `PrimaryGeneratedColumn` | `integer`, `PRIMARY KEY` |
| `number` | `Column` | `integer` |
| `string` | `Column` | `character varying` |
| `boolean` | `Column` | `boolean` |
| `Date` | `Column` | `timestamp without time zone` |
| 实体数组 | `OneToMany` | `PRIMARY KEY` 在对应 `ManyToOne` 的数据表中被标记为 `FOREIGN KEY` |
| 实体 | `ManyToOne` | 该实体的 `PRIMARY KEY` 设为 `FOREIGN KEY` |
| 实体数组 | `ManyToMany` | `PRIMARY KEY` 在自动创建的 JoinTable 中被标记为 `FOREIGN KEY` |

## 数据库 ER 图

![ER 图](assets/ER图.png)
