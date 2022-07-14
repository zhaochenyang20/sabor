!!! attention "阅读说明"

    在阅读以下内容前，请确保您已经仔细阅读了[说明部分](index.md)的相关内容。


## GET `/api/projects/:id/find-all-ori-require`

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询项目的所有原始需求。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |

### 返回

+ code: 200,
+ data: 数组，每一项描述一个原始需求。


## GET `/api/projects/:id/find-one-ori-require/:require`

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询项目 `id` 的 id 为 `require` 的原始需求。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `require` | `number` | 原始需求 id | 

### 返回

!!! note "原始需求返回值"

    返回原始需求时，将返回以下内容:

    + `id`: `number`, 原始需求编号
    + `name`: `string` 原始需求名称
    + `description`: `string`, 原始需求说明
    + `projectId`: `number`, 原始需求所属项目 id
    + `creatorName`: `string`, 创建者的用户名
    + `functionalRequirementIds`: `number[]`, 功能需求的 id
    + `functionalRequirements`: 数组，每一项包含一个功能需求的详情
        + `id`: `number`, 功能需求 id
        + `name`: `string`, 功能需求名称
        + `description`: `string`, 功能需求说明
        + `state`: 功能需求状态

正常

+ code: 200,
+ data: 查询到的功能需求。

若未找到原始需求，返回

+ code: 404,
+ data: `"001# Original requirement not found"`

## POST `/api/projects/:id/create-ori-require`

需要登录，需要系统工程师权限

### 功能说明

新建一个原始需求

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `name` | `string` | 原始需求名称，不可与项目内其它原始需求名称重复 |
| `description` | `string` | 原始需求说明 |

### 返回

正常

+ code: 200,
+ data: 
    + `originalRequirementId`: `number`, 原始需求 id

原始需求名称为空，返回

+ code: 400,
+ data: `"001# Requirement's name check failed"`

若名称与项目内其它原始需求重复，返回

+ code: 400,
+ data: `"002# Name ${ori.name} duplicates"`

## POST `/api/projects/:id/update-ori-require`

需要登录，需要系统工程师权限

### 功能说明

更新某个原始需求。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` (path) | `number` | 项目 id |
| `id` (body) | `number` | 原始需求 id |
| `name?` | `string` | 修改后原始需求名称，不存在表示不修改 |
| `description?` | `string` | 修改后原始需求说明，不存在表示不修改 |

### 返回

正常

+ code: 200,
+ data: `number`, 原始需求 id



若原始需求不存在，返回

+ code: 404,
+ data: `"001# original requirement ${id} not found"`

若修改后原始需求名称为空，返回

+ code: 400,
+ data: `"002# Requirement's name check failed"`

若修改后原始需求名称重复，返回

+ code: 400,
+ data: `"003# Name ${ori.name} duplicates"`

## POST `/api/projects/:id/delete-ori-require`

需要登录，需要系统工程师权限。

### 功能说明

删除指定 id 的原始需求，其下的功能需求也会删除。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` (path) | `number` | 项目 id |
| `id` (body) | `number` | 原始需求 id |

### 返回值

正常

+ code: 200
+ data: `number`, 原始需求id

若原始需求不存在

+ code: 404
+ data: `"001# Original requirement not found"`


若原始需求不属于该项目

+ code: 403
+ data: `"Unauthorized"`

## GET `/api/projects/:id/find-all-func-require/:ori`

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询项目 `id` 下，原始需求 `ori` 的所有功能需求。如果 `ori` 为 0，则返回项目 `id` 下所有的功能需求。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `ori` | `number` | 原始需求 id |

### 返回

!!! note "功能需求返回值"

    当返回功能需求时，将返回如下内容：
    
    + `id`: `number`, 功能需求 id
    + `name`: `string` 功能需求名称
    + `description`: `string`, 功能需求说明
    + `state`: `number`, 功能需求状态
    + `projectId`: `number`, 功能需求所属项目 id
    + `originalRequirementId`: `number` 功能需求所属原始需求 id
    + `distributorId`: `number`, 派发者id
    + `developerId`: `number`, 开发者id，不存在为 0
    + `systemServiceId?`: `number`, 系统服务 id, 不存在则为 `undefined`
    + `deliveryIterationId?`: `number`, 迭代 id, 不存在则为 `undefined`
    + `createDate`: `number`，创建时间
    + `updateDate`: `number`，更新时间

+ code: 200
+ data: 数组，每项返回一个功能需求

## POST `/api/projects/:id/find-func-require-by-id`

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

根据 id 数据查找多个功能需求。

只会返回查到且属于项目 `id` 的迭代，因此不能保证返回顺序。

允许传入 id 重复，只返回一个。

### 参数

* 参数：Body

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `ids` | `number[]` | 查询的功能需求 id |

### 返回

+ code: 200
+ data: 数组，每项表示一个查询到的功能需求

## GET /api/projects/:id/find-one-func-require/:func

需要登录，需要管理员、开发工程师、系统工程师或质量保证工程师权限。

### 功能说明

查询项目 `id` 的功能需求。需要登录，需要在项目`id`内

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` | `number` | 项目 id |
| `func` | `number` | 功能需求 id |

### 返回

+ code: 200
+ data: 查询到的功能需求

若功能需求不存在

+ code: 404
+ data: `002# Functional requirement ${funcId} does not exist`


若功能需求不属于该项目

+ code: 403
+ data: `001# It is unauthorized to find functional requirement ${funcId}`


## Post /api/projects/:id/create-func-require

需要登录，需要系统工程师权限。

### 功能说明

新建或更新一个功能需求。

派发者固定为发送该请求的用户。

### 参数

新建

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` (path) | `number` | 项目 id |
| `name` | `string` | 功能需求名称，不能重复 |
| `description` | `string` | 功能需求说明 |
| `state` | `number` | 1-3 的整数，表示需求开发状态 |
| `systemServiceId?` | `number` | 关联的系统服务，不存在表示不关联 |
| `iterationId?` | `number` | 关联的迭代，不存在表示不关联 |
| `developterId?` | `number` | 指定的开发工程师，不存在表示不指定 |

更新

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` (path) | `number` | 项目 id |
| `id` (body) | `number` | 功能需求 id |
| `name?` | `string` | 修改功能需求名称，不存在表示不修改 |
| `description?` | `string` | 功能需求说明，不存在表示不修改 |
| `state?` | `number` | 1-3 的整数，表示需求开发状态，不存在表示不修改 |
| `systemServiceId?` | `number` | 关联的系统服务，不存在表示不修改，0 表示解除当前绑定 |
| `iterationId?` | `number` | 关联的迭代，不存在表示不修改，0 表示解除当前绑定 |
| `developterId?` | `number` | 指定的开发工程师，不存在表示不指定, 0 表示解除当前绑定 |


### 返回

正常

+ code: 200,
+ data: `number`, 功能需求的 id

功能需求为空

+ code: 400
+ data: `"001# Functional requirement's name check failed"`

指定的不是开发工程师

+ code: 403
+ data: `"002# User ${funcDto.developerId} is not a development engineer"`

原始需求不存在

+ code: 404
+ data: `"003# Original requirement ${funcDto.originalRequirementId} does not exist"`

系统服务不存在

+ code: 404
+ data: `"004# System service ${funcDto.systemServiceId} does not exist"`


迭代不存在

+ code: 404
+ data: `"005# Iteration ${funcDto.iterationId} does not exist"`

功能需求不存在

+ code: 404
+ data: `"006# Functional requirement ${funcDto.id} does not exist"`

功能需求名称不合法

+ code: 400
+ data: `"007# Functional requirement's name check failed"`

功能需求不属于该项目

+ code: 403
+ data: `"008# It is unauthorized to find functional requirement ${funcDto.id}`

功能需求名称重复

+ code: 400
+ data: `"009# Name ${funcDto.name} duplicates"`

## POST `/api/projects/:id/delete-func-require`

需要登录，需要系统工程师权限。

### 功能说明

删除指定id的功能需求。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` (path) | `number` | 项目 id |
| `id` (body) | `number` | 功能需求 id |

### 返回值

正常

+ code: 200
+ data: `number`, 功能需求id

若功能需求不存在

+ code: 404
+ data: `"002# Functional requirement ${funcId} does not exist"`

## POST /api/projects/:id/change-func-require-state

需要登录，需要开发工程师权限

### 功能说明

修改某个功能需求状态。

### 参数

| 参数名 | 类型 | 说明 |
| ------  | --- | --- |
| `id` (path) | `number` | 项目 id |
| `id` (body) | `number` | 功能需求 id |
| `state` | `number` | 1-3 的整数，代表新开发状态 |


### 返回

+ code: 200
+ data: `number`, 功能需求 id



功能需求不属于该项目

+ code: 403
+ data: `"001# It is unauthorized to touch functional requirement ${funcDto.id}"`

功能需求不存在

+ code: 404
+ data: `"002# Functional requirement ${funcDto.id} does not exist"`
