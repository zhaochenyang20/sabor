title: 用户管理系统

## 用户 User
| 字段 | 类型 | Typeorm 装饰器 | 属性 | 说明 |
| ------  | --- | --- | --- | --- |
| `id` | `number` | `PrimaryGeneratedColumn` | `PRIMARY KEY`, `Unique` | 用户 ID |
| `username` | `string` | `Column` | `Unique` | 用户名称 |
| `password` | `string` | `Column` |  | 用户密码（经过哈希处理） |
| `salt` | `string` | `Column` | | 对密码哈希时添加的盐 |
| `ownProjects` | [Project](../project/#project)[] | `OneToMany` | | 用户作为管理员的项目 |
| `sysProjects` | [Project](../project/#project)[] | `ManyToMany` | | 用户作为系统工程师的项目 |
| `devProjects` | [Project](../project/#project)[] | `ManyToMany` | | 用户作为开发工程师的项目 |
| `qaProjects` | [Project](../project/#project)[] | `ManyToMany` | | 用户作为质量保障工程师的项目 |
| `createDate` | `Date` | `CreateDateColumn` | `Auto-generated` | 创建时间 |
| `updateDate` | `Date` | `UpdateDateColumn` | `Auto-generated` | 更新时间 |

