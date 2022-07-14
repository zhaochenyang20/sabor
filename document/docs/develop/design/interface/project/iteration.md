!!! attention "阅读说明"

    在阅读以下内容前，请确保您已经仔细阅读了[说明部分](index.md)的相关内容。


## GET `/api/projects/:id/find-all-iter`

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询项目`id`的所有迭代。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |

### 返回

!!! note "迭代返回值"
    
    当返回迭代时，将返回以下内容:
    
    
    + `id`: `number`， 迭代 id
    + `name`: `string`, 迭代名称
    + `description`: `string`， 迭代说明
    + `deadline`: `number` 迭代截止时间
    + `state`: `number`, 迭代状态
    + `directorUsername`: `string`, 开发负责人用户名
    + `functionalRequirementIds`: `number[]`, 功能需求 id
    + `functionalRequirements`: 数组，每项包含一个功能需求，
        + `id`: `number`, 
        + `name`: `string`,
        + `description`: `string`,
        + `state`: `number`,
    + `createDate`: `number`，创建时间
    + `updateTime`: `number`，更新时间

## POST `/api/projects/:id/find-iter-by-id`

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

根据id数据查找多个迭代。

只会返回查到且属于该项目的迭代，因此不能保证返回顺序。

允许传入id重复，只返回一个。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `ids` |  `number[]` | 迭代 id |

### 返回

+ code: 200
+ data: 数组，每一项为查询到的迭代

## GET `/api/projects/:id/find-one-iter/:iter`

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询 id 为 `iter` 的迭代。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `iter` |  `number` | 迭代 id |


### 返回

正常

+ code: 200
+ data: 查询到的迭代

错误

若迭代不存在，返回

+ code: 404
+ data: `"001# Iteration ${iter} does not exist"`

## POST `/api/projects/:id/create-iter`

需要登录，需要系统工程师权限

### 功能说明

新建或更新一个迭代。

### 参数

新建

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `name` | `number` | 迭代名称，不能重复或为空 |
| `description` | `string` | 迭代描述 |
| `deadline` | `number` | 迭代截止时间，13 位 Timestamp，需晚于当前服务器时间 |
| `directorUsername` | `string` | 负责人用户名 |

更新

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id`(path) | `number` | 项目 id |
| `id`(body) | `number` | 迭代 id |
| `name?` | `number` | 迭代名称，不能重复或为空 |
| `description?` | `string` | 迭代描述 |
| `deadline?` | `number` | 迭代截止时间，13 位 Timestamp，需晚于当前服务器时间 |
| `directorUsername?` | `string` | 负责人用户名 |

上述可选项，不存在代表不修改。

### 返回

正常

+ code: 200,
+ data: `number`， 迭代 id

迭代不属于该项目

+ code: 403,
+ data: `"001# It is unauthorized to change iteration ${iterDto.id}"`
}

迭代名称为空

+ code: 400,
+ data: `"002# Iteration's name check failed"`

截止时间早于当前服务器时间

+ code: 400,
+ data: `"003# Earlier DDL"`

开发负责人不存在

+ code: 400,
+ data: `"004# User ${directorUsername} does not exist"`

迭代不存在

+ code: 404,
+ data: `"005# Iteration ${id} does not exist"`

## GET /api/projects/:id/find-all-func-require/iter/:iter

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询某个迭代内所有的功能需求

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `iter` |  `number` | 迭代 id |


### 返回

+ code: 200
+ data: 数组，每一项为一个[功能需求](requirement.md#_18)。

## Post /api/projects/:id/delete-iter

需要登录，需要系统工程师权限。

### 功能说明

删除指定 id 的迭代。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` (path) | `number` | 项目 id |
| `id` (body) | `number` | 迭代 id |

### 返回

正常

+ code: 200
+ data: `number`, 迭代 id

迭代不存在

+ code: 404
+ data: `"001# Iteration ${iterId} does not exist"`
    
迭代不属于该项目

+ code: 400
+ data: `"002# Project ${projectId} does not have Iteration ${iterId}"`

