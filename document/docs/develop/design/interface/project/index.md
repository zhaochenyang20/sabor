title: 项目模块

!!! attention "阅读说明"

    在阅读以下内容前，请确保您已经仔细阅读了[说明部分](index.md)的相关内容。

本部分介绍项目信息管理的 API，关于项目管理系统下属的几个子系统，请查看对应的子页面。

## POST `/api/projects/create`

需要登录

### 功能说明

创建项目，名称可以重复

### 参数


| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `projectName` | `string` | 项目名称，可以重复 |
| `description?` | `string` | 项目描述 |
| `managerName` | `string` | 项目管理员 |

### 返回

成功

+ code: 200
+ data: 
    + `id`: `number`，分配的项目 id
    + `name`: `string`，项目名称

失败（项目管理员不存在、名称为空）

+ code: 400
+ data: 错误信息

## POST `/api/projects/:id/update-project`

需要登录，需要项目管理员模块。

### 功能说明

更新项目信息。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `name?` | `string` | 修改后项目名称，不能为空字符串，`null` 或 `undefined` （不存在此项）表示不修改 |
| `description?` | `string` | 修改后项目描述，不存在此项表示不修改 |

### 返回

成功

+ code: 200,
+ data: `number` 项目 id

若项目名为空

+ code: 400
+ data: `"001# Project's name check failed"`


## GET /api/projects/find-all

需要登录

### 功能说明

查找该用户参与（为管理员或工程师）的所有项目。

### 参数

无

### 返回

+ code: 200
+ data: 数组，每一项包含
    + id: `number`, 项目 id
    + name: `string`, 项目名称
    + description: `string`, 项目说明
    + manager: `string`, 管理员用户名
    + developmentEngineers: `Array<string>` 开发工程师用户名列表
    + systemEngineers: `Array<string>`, 系统工程师用户名列表
    + qualityAssuranceEngineers: `Array<string>`, 质量保证工程师用户名列表
    + createDate: `number`, 项目创建时间戳
    + updateDate: `number`, 项目更新时间时间戳

## GET `/api/projects/:id/find-one`

需要登录

### 功能说明

根据项目 id 查找项目

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |

### 返回

查询成功

+ code: 200
+ data: 
    + id: `number`, 项目 id
    + name: `string`, 项目名称
    + description: `string`, 项目说明
    + manager: `string`, 管理员用户名
    + developmentEngineers: `Array<string>` 开发工程师用户名列表
    + systemEngineers: `Array<String>`, 系统工程师用户名列表
    + qualityAssuranceEngineers: Array<String>, 质量保证工程师用户名列表
    + createDate: `number`, 项目创建时间戳
    + updateDate: `number`, 项目更新时间时间戳


若项目 id 不合法

+ code: 400,
+ data: `"001# Project's id check failed"`

若项目不存在

+ code: 404,
+ data: `"002# Project ${projectId} not found"`

若用户未参与该项目


+ code: 403,
+ data: `"003# User ${username} is not authorized to access this project"`


## GET `/api/projects/:id/delete-project`

需要登录，需要是该项目管理员。

### 功能说明

删除项目 id 对应的项目

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |


### 返回

+ code: 200
+ data: `number` 项目 id

## POST `/api/projects/:id/invite`

需要登录。需要拥有项目管理员权限。

### 功能说明

邀请用户加入项目

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `invitedUser` | `number` | 邀请的用户的编号 |
| `grantedRole` | `number[]` | 被赋予的权限，见下 |

`grantedRole` 的取值如下：

+ 1: 系统工程师
+ 2: 开发工程师
+ 3: 质量保证工程师  

具体含义如下：若 `grantedRole` 中包含 1,2,3，则该角色成为相应角色；若 `grantedRole` 中不含 1,2,3，则该角色对应角色（若有）被删除。其余数字将会被忽略。

### 返回

成功时：

+ code: 200,
+ data:
    + funcIds: `[]`,
    + iterIds: `[]`

当开发工程师正在负责功能需求或迭代时，不能删除，返回（这次通信其它操作不会受影响）：


+ code: 200,
+ data: 
    + funcIds: `number[]`, 表示与开发工程师有关联的功能需求id
    + iterIds: `number[]`, 表示开发工程师负责的迭代id

若用户不存在时，返回

+ code: 400
+ data: 错误信息
 
