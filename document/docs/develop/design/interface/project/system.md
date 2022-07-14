!!! attention "阅读说明"

    在阅读以下内容前，请确保您已经仔细阅读了[说明部分](index.md)的相关内容。


## GET `/api/projects/:id/find-all-sys-serv`

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询项目`id`的所有系统服务。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |

### 返回

!!! note "系统服务返回值"

    返回系统服务时，将返回以下内容:
    
    + `id`: `number`, 系统服务 id
    + `name`: `string`, 系统服务名称
    + `description`: `string`, 系统服务说明
    + `functionalRequirementIds`: `number[]`，功能需求 id
    + `functionalRequirements`: 数组，每一项为一个功能需求
        - `id`: `number` 功能需求 id
        - `name`: `string`, 功能需求名称
        - `description`: `string`, 功能需求说明
        - `state`: `number`, 功能需求状态
    + `createDate`: `number`, 创建时间
    + `updateTime`: `number`, 更新时间

+ code: 200
+ data: 数组，每一项为一个系统服务

## GET /api/projects/:id/find-one-sys-serv/:serv

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询项目 `id` 的系统服务。

### 参数

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `serv` | `number` | 系统服务 id |

### 返回

+ code: 200
+ data: 查询的系统服务 id

若系统服务不存在

+ code: 404,
+ data: `"001# System service ${id} does not exist"`

## POST `/api/projects/:id/update-sys-serv`

需要登录，需要系统工程师权限

### 功能说明

新建或更新一个系统服务。名称不能重复。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `name?` | `string` | 原系统服务名称，不存在为创建，否则为更新 |
| `newName?` | `string` | 新系统服务名称，更新时可选 |
| `description?` | `string` | 系统服务说明，创建时必选，更新时可选 |

### 返回

正常


+ code: 200,
+ data: `number` 系统服务名称

若系统服务名称为空

+ code: 400,
+ data: `"001# system service's name check failed"`

若说明为空

+ code: 400,
+ data: `"003# Create but no description"`

若修改名称为空

+ code: 400,
+ data: "004# New name check failed"

若名称重复

+ code: 400,
+ data: `"005# New name duplicates"`

## GET `/api/projects/:id/find-all-func-require/serv/:serv`

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询某个系统服务内所有的功能需求

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `serv` | `number` | 系统服务 id |

### 返回

+ code: 200
+ data: 数组，每一项为一个[功能需求](requirement.md#_18)。

## POST `/api/projects/:id/delete-sys-serv`

需要登录，需要系统工程师权限。

### 功能说明

删除指定 id 的系统服务。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` (path) | `number` | 项目 id |
| `id` (body) | `number` | 系统服务 id |

### 返回

正常

+ code: 200
+ data: `number`, 系统服务id

系统服务不存在

+ code: 404
+ data: `"001# System service ${servId} does not exist"`
    
系统服务不属于该项目

+ code: 400
+ data: `"002# Project ${projectId} does not have System service ${servId}"`
