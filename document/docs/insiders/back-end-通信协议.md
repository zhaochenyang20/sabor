---
template: overrides/main.html
title: insiders
---

# 通信协议

## Iteration

### Get /api/projects/:id/find-all-iter

* 说明：查询项目`id`的所有迭代。需要登录，需要在项目`id`内。
* 参数：Param

```typescript
id: Number // 项目id
```

* 返回值：

```typescript
{
    "code": 200,
    "data": [
        {
            id: Number,
            name: String,
            description: String,
            deadline: Timestamp,
            state: Number,
            directorUsername: String,
            functionalRequirementIds: Number[],
            "functionalRequirements": [
                {
                    "id": Number,
                    "name": String,
                    "description": String,
                    "state": Number,
                }
            ...],
            createDate: Timestamp,
            updateTime: Timestamp,
        },
		...,
    ]
}
```

### Post /api/projects/:id/find-iter-by-id

* 说明：根据id数据查找多个迭代。需要登录，需要在项目`id`内。

只会返回查到且属于项目`id`的迭代，因此不能保证返回顺序。

允许传入id重复，只返回一个。

* 参数：Body

```typescript
{
    "ids": Number[]
}
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": [
        {
            id: Number,
            name: String,
            description: String,
            deadline: Timestamp,
            state: Number,
            directorUsername: String,
            functionalRequirementIds: Number[],
            "functionalRequirements": [
                {
                    "id": Number,
                    "name": String,
                    "description": String,
                    "state": Number,
                }
            ...],
            createDate: Timestamp,
            updateTime: Timestamp,
        },
		...,
    ]
}
```

### Get /api/projects/:id/find-one-iter/:iter

* 说明：查询项目`id`的id为iter的迭代。需要登录，需要在项目`id`内
* 参数：Param

```typescript
id: Number // 项目id
iter: Number // 迭代id
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": {
            id: Number,
            name: String,
            description: String,
            deadline: Timestamp,
            state: Number,
            directorUsername: String,
            functionalRequirementIds: Number[],
            "functionalRequirements": [
                {
                    "id": Number,
                    "name": String,
                    "description": String,
                    "state": Number,
                }
            ...],
            createDate: Timestamp,
            updateTime: Timestamp,
    }
}
```

错误

```typescript
{
    "code": 404,
    "data": "001# Iteration ${iter} does not exist"
}
```

### Post /api/projects/:id/create-iter
**创建和更新迭代信息的通讯已经被 zcy 写在了 views/systemEngineer/origin 里面**
* 说明：新建或更新一个迭代。需要登录，需要在项目`id`内，需要是系统工程师
* 参数：Body

新建

```typescript
{
    "name": String,
    "description": String,
    "deadline": Number, // 13位Timestamp，需晚于当前时间
    "directorUsername": String // 负责人username
}
```

更新

```typescript
{
    "id": Number,
    "name"?: String,
    "description"?: String,
    "deadline"?: Number, // 13位Timestamp，需晚于当前时间
    "directorUsername"?: String,
    "state"?: Number // 1~4
}
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": ${iter.id}
}
```

错误

```typescript
{
    "code": 403,
    "data": "001# It is unauthorized to change iteration ${iterDto.id}"
}
```

```typescript
{
    "code": 400,
    "data": "002# Iteration's name check failed"
}
```

```typescript
{
    "code": 400,
    "data": "003# Earlier DDL"
}
```

```typescript
{
    "code": 400,
    "data": "004# User ${directorUsername} does not exist"
}
```

```typescript
{
    "code": 404,
    "data": "005# Iteration ${id} does not exist"
}
```

```typescript
{
	code: >=400,
	data: Other
}
```

### Get /api/projects/:id/find-all-func-require/iter/:iter

* 说明：查询某个迭代内所有的功能需求
* 参数：Param

```typescript
{
    id: Number, // 项目id
    iter: Number // 迭代id
}
```

### Post /api/projects/:id/delete-iter

* 说明：删除指定id的迭代。需要登录，需要是项目内的系统工程师。
* 参数：

Param

```typescript
id: Number // 项目id
```

Body

```typescript
{
    id: Number // 迭代id
}
```

* 返回值

正常

```typescript
{
    code: 200
    data: Number // 迭代id
}
```

错误

```typescript
{
    code: 404
    data: "001# Iteration ${iterId} does not exist"
}
```

```typescript
{
    code: 400
    data: "002# Project ${projectId} does not have Iteration ${iterId}"
}
```

* 返回值：

与 Get /api/projects/:id/find-all-func-require/:ori 类似

## Projects

### Post /api/projects/create

需要登录

* 说明：创建项目，名称可以重复
* 参数：Body

```typescript
{
    "projectName": String,
    "description": String, // IsOptional()
    "managerName": String
}
```

* 返回值：

成功

```typescript
{
    "code": 200,
    "data": {
        "id": Number,
        "name": String
    }
}
```

失败（manager不存在、名称检查失败）

```typescript
{
    "code": 400,
    "data": String
}
```

### Post /api/projects/:id/update-project

* 说明：更新项目信息，name可以重复但不能为空。需要登录，需要是manager。

* 参数：Body，Param（:id）

```typescript
{
    "name"?: String,
    "description"?: String
}
```

* 返回值：

成功

```typescript
{
    "code": 200,
    "data": ${projectId}
}
```

失败

```typescript
{
    "code": 400,
    "data": "001# Project's name check failed"
}
```

### Get /api/projects/find-all

需要登录

* 说明：查找所有项目，只返回与用户有关系的（是负责人或工程师）
* 参数：无

* 返回值：

```typescript
{
    code: 200,
    data: [
                {
                    id: Number,
                    name: String,
                    description: String,
                    manager: String, // manager's name
                    developmentEngineers: Array<String>, // names
                    systemEngineers: Array<String>,
                    qualityAssuranceEngineers: Array<String>,
                    createDate: Timestamp,
                    updateDate: Timestamp
                }
    ]
    
}
```

### Get /api/projects/:id/find-one

需要登录

* 说明：根据id查找项目
* 参数：Param（即:id为参数id）

```typescript
id: String
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": {
            "id": Number,
            "name": String,
            "description": String,
            "manager": String, // manager's name
            "developmentEngineers": Array<String>, // names
            "systemEngineers": Array<String>,
            "qualityAssuranceEngineers": Array<String>,
            "createDate": Timestamp,
            "updateDate": Timestamp
        }
}
```

错误

```typescript
{
    "code": 400,
    "data": "001# Project's id check failed"
}
```

```typescript
{
    "code": 404,
    "data": "002# Project ${projectId} not found"
}
```

```typescript
{
    "code": 403,
    "data": "003# User ${username} is not authorized to access this project"
}
```

### Get /api/projects/:id/delete-project

删除项目`id`，需要是该项目管理员。

* 参数：Param（即:id为参数id）

```typescript
id: Number
```

* 返回值：
```typescript
{
    "code": 200,
    "data": ${id}
}
```

### POST /api/projects/:id/invite

需要登录。需要拥有项目管理员权限。

对grantedRole参数说明如下：若grantedRole中含1/2/3，则该角色成为系统工程师/开发工程师/QA 工程师；若grantedRole中不含1/2/3，则该角色对应角色（若有）被删除。

当开发工程师正在负责功能需求或迭代时，无法删除，且会返回需要手动更改的id数组。若funcIds和iterIds都为空，则说明删除开发工程师成功。

+ params:
  - id (URL): 项目编号

+ body
  - `invitedUser` (POST body): 邀请的用户的**编号**，需要以`number`类型传输。
  - `grantedRole` (POST body)：赋予的权限，取值如下：
     + 1: 系统工程师
     + 2: 开发工程师
     + 3: QA 工程师  
     需要以 `number[]` 类型传输。

+ returns:
成功时：

```typescript
{
    code: 200,
    data: {
        funcIds: [],
        iterIds: []
    }
}
```

删除开发工程师失败时（这次通信其它操作不会受影响）：

```typescript
{
    code: 200,
    data: {
        funcIds: Number[], // 表示与开发工程师有关联的功能需求id，可以用find-func-require-by-id查询
        iterIds: Number[] // 表示开发工程师负责的迭代id，可以用find-iter-by-id查询
    }
}
```

其它失败时：（`data` 为 `string` 类型错误信息）
- 用户不存在：400
- 项目不存在: 404
- URL 不合法 （id 不为 number）：400
- 未登录: 401
- 登录无权限： 403

## Requirement

### Get /api/projects/:id/find-all-ori-require

* 说明：查询项目`id`的所有原始需求。需要登录，需要在项目`id`内（同invite）
* 参数：Param（即:id为参数id）

```typescript
id: Number
```

* 返回值：

```typescript
{
    code: 200,
    data: [{
            "id": Number,
            "name": String,
            "description": String,
            "projectId": Number,
            "creatorName": String, // 创建者的username
            "functionalRequirementIds": Number[], // 功能需求的id
            "functionalRequirements": [
                {
                    "id": Number,
                    "name": String,
                    "description": String,
                    "state": Number,
                }
            ...]
        }, 
        ...]
}
```

### Get /api/projects/:id/find-one-ori-require/:require

* 说明：查询项目`id`的id为`require`的原始需求。需要登录，需要在项目`id`内
* 参数：Param

```
id: Number
require: Number
```

* 返回值：

正常

```typescript
{
    code: 200,
    data: {
            "id": Number,
            "name": String,
            "projectId": Number,
            "description": String,
            "creatorName": String, // creator's username
            "functionalRequirementIds": Number[] // functional requirements' id
            "functionalRequirements": [
                {
                    "id": Number,
                    "name": String,
                    "description": String,
                    "state": Number,
                }
            ...]
        }
}
```

错误

```typescript
{
	code: 404,
	data: '001# Original requirement not found'
}
```

### Post /api/projects/:id/create-ori-require
**zcy 已编写完成，在 /src/views/systemEngineer/origin 下**

* 说明：新建一个原始需求。需要登录，需要在项目`id`内，需要是系统工程师
不可重名

* 参数：Body

```typescript
{
    "name": String,
    "description": String,
    "state": Number // 1~4: 初始化，已分解，进行中，已交付。 注：现已废弃，不需要此字段
}
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": {
        "originalRequirementId": Number
    }
}
```

错误

```typescript
{
	code: 400,
	data: "001# Requirement's name check failed"
}
```

```typescript
{
	code: 400,
	data: '002# Name ${ori.name} duplicates'
}
```

```typescript
{
	code: >=400,
	data: Other
}
```

### Post /api/projects/:id/update-ori-require
**已由 zcy 在 views/systemEngineer/origin 中编写**

* 说明：
1. 更新某个原始需求。需要登录，需要在项目`id`内，需要是系统工程师
2. body 里的 id 是 originRequire 的 id，不是 url 里那个项目 id
3. name, description, state 如果不传入，就不会更改。注：state已废弃，不需要添加此字段
4. 请界面设计师一定要把 id 和 state 的默认值设置为 0，便于检测是否更改
5. 不可重名

* 参数：Body

```typescript
{
    "id": Number,
    "name": String, // IsOptional
    "description": String, // IsOptional
    "state": Number // IsOptional
}
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": ${id}
}
```

错误

```typescript
{
	code: 404,
	data: `001# original requirement ${id} not found`
}
```

```typescript
{
	code: 400,
	data: "002# Requirement's name check failed"
}
```

```typescript
{
	code: 400,
	data: "003# Name ${ori.name} duplicates"
}
```

```typescript
{
	code: 403,
	data: "004# It is unauthorized to change original requirement ${ori.id}"
}
```

### Post /api/projects/:id/delete-ori-require

* 说明：删除指定id的原始需求，其下的功能需求也会删除。需要登录，需要是项目内的系统工程师。
* 参数：

Param

```typescript
id: Number // 项目id
```

Body

```typescript
{
    id: Number // 原始需求id
}
```

* 返回值

正常

```typescript
{
    code: 200
    data: Number // 原始需求id
}
```

错误

```typescript
{
    code: 404
    data: "001# Original requirement not found"
}
```

```typescript
{
    code: 403
    data: "Unauthorized" // 原始需求不属于该项目
}
```

### Get /api/projects/:id/find-all-func-require/:ori

* 说明：查询项目`id`下，原始需求`ori`的所有功能需求。
如果`ori`为0，则返回项目`id`下所有的功能需求。
需要登录，需要在项目`id`内。
* 参数：Param

```typescript
id: Number // 项目id
ori: Number // 原始需求id
```

* 返回值：

```typescript
{
    "code": 200,
    "data": [
            {
                "id": Number, // Functional requirement id
                "name": String,
                "description": String,
                "state": Number,
                "projectId": Number,
                "originalRequirementId": Number,
                "distributorId": Number, // 派发者id
                "developerId": Number, // 开发者id
                "systemServiceId": Number,
                "deliveryIterationId": Number,
                "createDate": Timestamp,
                "updateDate": Timestamp
            },
            ...
    ]
}
```

### Post /api/projects/:id/find-func-require-by-id

* 说明：根据id数据查找多个功能需求。需要登录，需要在项目`id`内。

只会返回查到且属于项目`id`的迭代，因此不能保证返回顺序。

允许传入id重复，只返回一个。

* 参数：Body

```typescript
{
    "ids": Number[]
}
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": [
            {
                "id": Number, // Functional requirement id
                "name": String,
                "description": String,
                "state": Number,
                "projectId": Number,
                "originalRequirementId": Number,
                "distributorId": Number, // 派发者id
                "developerId": Number, // 开发者id
                "systemServiceId": Number,
                "deliveryIterationId": Number,
                "createDate": Timestamp,
                "updateDate": Timestamp
            },
            ...
    ]
}
```

### Get /api/projects/:id/find-one-func-require/:func

* 说明：查询项目`id`的id为`func`的功能需求。需要登录，需要在项目`id`内
* 参数：Param

```typescript
id: Number // 项目id
func: Number // 功能需求id
```

* 返回值：

```typescript
{
    "code": 200,
    "data": {
            "id": Number, // Functional requirement id
            "name": String,
            "description": String,
            "state": Number,
            "originalRequirementId": Number,
            "distributorId": Number, // 派发者id
            "developerId": Number, // 开发者id
            "systemServiceId": Number,
            "deliveryIterationId": Number,
            "createDate": Timestamp,
            "updateDate": Timestamp
        },
    }
}
```

### Post /api/projects/:id/create-func-require

* 说明：
  

新建或更新一个功能需求。

需要登录，需要在项目`id`内，需要是系统工程师。

派发者固定为发送该请求的用户。

不可重名


* 参数：Body（与find-all-func-require含义类似）

新建

```typescript
{
    "name": String,
    "description": String,
    "originalRequirementId": Number,
    "systemServiceId"?: Number,
    "iterationId"?: Number,
    "developerId"?: Number
}
```

更新

```typescript
{
    "id": Number,
    "name"?: String,
    "description"?: String,
    "state"?: Number, // 1~4
    "originalRequirementId"?: Number,
    "systemServiceId"?: Number,
    "iterationId"?: Number,
    "developerId"?: Number
}
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": ${func.id} // 功能需求的id
}
```

错误

```typescript
{
    code: 400
    data: "001# Functional requirement's name check failed"
}
```

```typescript
{
    code: 403
    data: "002# User ${funcDto.developerId} is not a development engineer"
}
```

```typescript
{
    code: 404
    data: "003# Original requirement ${funcDto.originalRequirementId} does not exist"
}
```

```typescript
{
    code: 404
    data: "004# System service ${funcDto.systemServiceId} does not exist"
}
```

```typescript
{
    code: 404
    data: "005# Iteration ${funcDto.iterationId} does not exist"
}
```

```typescript
{
    code: 404
    data: "006# Functional requirement ${funcDto.id} does not exist"
}
```

```typescript
{
    code: 400
    data: "007# Functional requirement's name check failed"
}
```

```typescript
{
    code: 403
    data: "008# It is unauthorized to find functional requirement ${funcDto.id}"
}
```

```typescript
{
    code: 400
    data: "009# It is unauthorized to find functional requirement ${funcDto.id}"
}
```

### Post /api/projects/:id/delete-func-require

* 说明：删除指定id的功能需求。需要登录，需要是项目内的系统工程师。
* 参数：

Param

```typescript
id: Number // 项目id
```

Body

```typescript
{
    id: Number // 功能需求id
}
```

* 返回值

正常

```typescript
{
    code: 200
    data: Number // 功能需求id
}
```

错误

```typescript
{
    code: 404
    data: "002# Functional requirement ${funcId} does not exist"
}
```

### Post /api/projects/:id/change-func-require-state

* 说明：修改某个系统服务的状态。需要登录，需要是开发工程师，系统工程师的接口见create-func-require。
* 参数：

Param

```typescript
id: Number // 项目id
```

Body

```typescript
{
    id: Number // 系统服务id
    state: Number // 1~3
}
```

* 返回值

正常

```typescript
{
    code: 200
    data: Number // 系统服务id
}
```

错误

```typescript
{
    code: 403
    data: "001# It is unauthorized to touch functional requirement ${funcDto.id}"
}
```

```typescript
{
    code: 404
    data: "002# Functional requirement ${funcDto.id} does not exist"
}
```

## SystemService

### Get /api/projects/:id/find-all-sys-serv

* 说明：查询项目`id`的所有系统服务。需要登录，需要在项目`id`内
* 参数：Param（即:id为参数id）

```typescript
id: Number
```

* 返回值：

```typescript
{
    "code": 200,
    "data": [
        {
            "id": Number,
            "name": String,
            "description": String,
            "functionalRequirementIds": FunctionalRequirement[], // 属于该系统服务的SR
            "functionalRequirements": [
                {
                    "id": Number,
                    "name": String,
                    "description": String,
                    "state": Number,
                }
            ...],
            "createDate": Number, // timestamp
            "updateTime": Number, // timestamp
        },
		...,
    ]
}
```

### Get /api/projects/:id/find-one-sys-serv/:serv

* 说明：查询项目`id`的id为serv的系统服务。需要登录，需要在项目`id`内
* 参数：Param

```
id: Number
serv: Number
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": {
        "id": Number,
        "name": String,
        "description": String,
        "functionalRequirementIds": FunctionalRequirement[],
            "functionalRequirements": [
                {
                    "id": Number,
                    "name": String,
                    "description": String,
                    "state": Number,
                }
            ...],
        "createDate": Number,
        "updateTime": Number
    }
}
```

错误

```typescript
{
    "code": 404,
    "data": "001# System service ${id} does not exist"
}
```

### Post /api/projects/:id/update-sys-serv

* 说明：新建或更新一个系统服务。都是这个接口，需要登录，需要在项目`id`内，需要是系统工程师
* 参数：Body

```typescript
{
    "name": String, // 不存在则create，否则update
    "newName": String, // update时可选
    "description": String // create时必选，update时可选
}
```

* 返回值：

正常

```typescript
{
    "code": 200,
    "data": ${serv.id}
}
```

错误

```typescript
{
    "code": 400,
    "data": "001# system service's name check failed"
}
```

```typescript
{
    "code": 404,
    "data": '002# Project does not exist'
}
```

```typescript
{
    "code": 400,
    "data": "003# Create but no description"
}
```

```typescript
{
    "code": 400,
    "data": "004# New name check failed"
}
```

```typescript
{
    "code": 400,
    "data": "005# New name duplicates"
}
```

```typescript
{
    "code": >=400,
    "data": Other
}
```

### Get /api/projects/:id/find-all-func-require/serv/:serv

* 说明：查询某个系统服务内所有的功能需求
* 参数：Param

```typescript
{
    id: Number, // 项目id
    serv: Number // 系统服务id
}
```

### Post /api/projects/:id/delete-sys-serv

* 说明：删除指定id的系统服务。需要登录，需要是项目内的系统工程师。
* 参数：

Param

```typescript
id: Number // 项目id
```

Body

```typescript
{
    id: Number // 系统服务id
}
```

* 返回值

正常

```typescript
{
    code: 200
    data: Number // 系统服务id
}
```

错误

```typescript
{
    code: 404
    data: "001# System service ${servId} does not exist"
}
```

```typescript
{
    code: 400
    data: "002# Project ${projectId} does not have System service ${servId}"
}
```

* 返回值：

与 Get /api/projects/:id/find-all-func-require/:ori 类似

## Users

### GET /api/users/find

说明：查询所有用户

参数：无

返回：

```json
{
  "code": 200,
  "data": [{
    "id": Number,
    "username": String
  }]
}
```

### POST /api/users/find

* 说明：查找指定username或id的用户，二者均为可选，优先username

* 参数：Body

```json
{
  username?: String,
  id?: Number,
}
```

* 返回：

存在

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": ${username}
  }
}
```

不存在

```json
{
  "code": 404,
  "data": "User ${username} not found"
}
```

### POST /api/users/register

* 说明：注册用户
* 参数：Body

```json
{
  "username": String,
  "password": String
}
```

* 返回：

注册成功

```json
{
  "code": 200,
  "data": "Registration success"
}
```

username检查失败

```json
{
  "code": 400,
  "data": "Username check failed"
}
```

password检查失败

```json
{
  "code": 400,
  "data": "Password check failed"
}
```

其它

```json
{
  "code": 400,
  "data": "Bad Request Exception"
}
```

### POST /api/users/login

进行用户登录
- param:
  + `username`: 用户名
  + `password`：密码
- returns:  
  正常情况下：
  + `code`: 200
  + `data`: `string`，表示用户的登录 token （之后称为用户 token）

  登录失败时：
  + `code`: 401
  + `data`：失败信息

### GET /api/users/testLogin

需要登录。

**注意：** 之后所有标注需要登录的地方，需要在 Header 中加入一个表项：`Authorization: Bearer `+ 之前发送的用户 token。

- param: 无
- returns:  
  正常情况下：
  + `code`: 200
  + `data`: 欢迎信息

  认证失败时：
  + `code`: 401
  + `data`: 失败信息。

### POST /api/users/changePassword

需要登录。

同时需要提供密码。

- param:
  + oldPassword: 原密码
  + newPassword: 新密码
  
- returns:
  正常情况下：
  + `code`: 200
  + `data`: 新的用户 token (注：在目前版本下，旧 token 依然能够登录，但不保证新版本依然会这样)

  原密码错误时：
  + `code`: 401

  新密码不合法时
  + `code`: 40

  上述 `data` 项均为错误信息。

## git

**后面我懒得写未登录返回 401，权限不足返回 403 了，项目不存在返回 404 了**。。。QAQ


### 关于 gitlab 的一些说明

由于 gitlab 可以在不同的网站部署，所以需要 gitlab URL，如 `https://gitlab.secoder.net/`

gitlab 仓库的指定是通过仓库编号，可以在仓库的主页看到

如果该仓库不是公开（public）项目的话，还需要提供 access token（有读取 api 的权限）

### GET /api/projects/:id/git/get-info

需要登录，需要项目管理员权限。

获取项目 git 仓库信息。

params:
+ id: 项目 id

returns:
+ `hasGitRepo`: `boolean`, 是否有 git repo 信息
+ `isGitLab`: `boolean`, 目前永远为 true
+ `detail`: `object`, 如果不存在 git repo 为空，否则为：
  - gitlabUrl: `string`, gitLab 地址
  - gitlabProjId: `number`, gitLab **项目ID**
  - gitAccessToken: `string`, gitlab access token

如果项目不存在，返回 404

### POST /api/projects/:id/git/set-info

需要登陆，需要项目管理员权限

修改项目 git 仓库信息

params:
+ id：项目 id
+ body:
  - url: `string`，特别地，如果为空表示删除 git 仓库信息。**需要带协议(http/https)**，如 `https://gitlab.secoder.net`
  - id: `number`, 仓库 Id
  - token: `string`，gitlab access token

returns:
+ 如果没有 MR 与功能需求关联，则会修改仓库信息，成功时返回：
  - code: 0
  - info: 成功信息
+ 否则如果存在 MR 与功能需求关联，则不允许修改仓库信息（URL/projectID，但允许修改 token），返回
  - code: 1
  - info: 说明信息
+ 如果设置成功，但是无法访问对应的 gitlab 仓库（如有），则返回：
  - code: 2
  - info: 说明信息

项目不存在，返回 404；数据库操作错误，返回 500.

### GET /api/projects/:id/git/get-merge-request
### GET /api/projects/:id/git/get-issue

这两个接口比较类似。

需要登录，需要项目管理员或 QA 身份

  params:
  + id: 项目id

  returns: data 项为 Object
  + `hasGitRepo`: 同 `get-info` API 描述
  + `networkFailed`：当 `hasGitRepo` 为真是存在，表示此次请求是否发生网络错误（如果使用缓存，则为 `false`）**5.3 更新：Deprecated**
  + `content`: 为一**列表**，其中每一项包含
    - id: `number`, MR/issue id
    - title: `string`， 标题
    - content: `string`，正文
    - state: `string`, **仅 get-issue 有此项**，表示 issue 状态（`opened`/`closed`）
    - relatedFunctionalRequirement: `object[]`， **仅 get-merge-request**有这一项，每一项表示 MR 关联的功能需求，包括两个内容
      + id: 对应功能需求的 id
      + name: 功能需求名称  
      + description: 功能需求描述  
      **5.2 更新**
    - assignee: (MR + issue) `string | null`, 分配任务的人的 gitlab 用户名, `null` 表示没有
    - createTime: (issue) `number | null`, issue 创建时间
    - closeTime: (issue) `number | null`, issue close 时间

  Issue 默认只会拉取 label/tag/标签 为 `bug`的。

  此项内容存在缓存，即获取的内容可能不是远程 git 仓库的实时内容，而是缓存之后的内容。目前缓存期限为 1h.

  当 git 服务器发生错误的时候，会返回缓存内容。

  **5.3 更新：** 缓存逻辑更新如下：每次 git 仓库配置更新是开始在后台缓存，如果该次查询距上次缓存超过 1h，则触发一次缓存更新（但是本次请求依然返回缓存内容），如果这次更新成功，则会写入数据库，否则，将允许在 5 分钟后重试（依然需要通过一次查询来触发）。

### POST /api/projects/:id/git/attach-merge-req-with-func-req

  将 功能需求 和 MR 关联。

  需要登录，需要项目管理员或 QA 身份

  params:
  + id: 项目 id

  body:
  + `addItem` 数组，每个元素包括两项，增加关联信息
    - functionalRequestId: `number`, 功能需求 ID
    - mergeRequestId: ` number`, MR ID
  + `delItem` 格式同上，删除的关联信息

  returns:
  + `success` when succeeded

  remark:
  + **UPD. on 5.4** 删除功能已实现，需要注意，addItem 和 delItem 只能出现一个，如果二者均出现，将只处理 addItem.
  + 发生下列情况的时候，将会自动跳过这一项请求，而不会报错。
    - 功能需求不存在或非本项目功能需求
    - MR 不存在
    - 功能需求和 MR 已经关联（addItem）或未关联（delItem）。

  ### GET /api/projects/:id/git/get-merge-req-of-func-req/:func

  获取与功能需求相关联的 MR。

  需要登录，需要项目管理员或 QA 身份

  params:
  + id: 项目 id
  + func: 功能需求 id

  returns:
  数组，每一项为：
  - id: MR id
  - title: MR 标题
  - content: MR 内容

  throws：
  当功能需求不存在或不属于该项目时，返回 400, data 信息中 code 为 1.

  ### GET /api/projects/:id/git/get-issue-closed-by/:issue

  获取 Issue 在哪些 MR 中得到解决。

  需要登录，需要项目管理员或 QA 身份。

  params:
  + id: 项目 id
  + issue: Issue id

  returns:

  数组，每一项为：
  - id: MR id
  - title: MR 标题
  - content: MR 内容

  throws：

  当 Issue 不存在时，返回 404

  Remark:

  这一部分内容采用同样采用缓存机制，具体细节如下：
  + 这一部分只拉取 MR 信息，因此新的 MR 会被发现并记录到缓存中
  + Issue 信息不会更新，因此如果在缓存期内新建了 Issue，那么将依然返回 400
  + 每一个 Issue 的关联 MR 信息将单独计算缓存期。
  + Best practice：首先进行一次 `get-issue`，然后再对每一项获取 MR 信息。

  ### GET /api/projects/:id/git/get-mr-suggest/:mr 

  提供 MR 与 SR 关联的建议。**不会实际操作数据库**。

  params:

  + id: projectId
  + mr: mergeRequstId

  returns:
  + 数组，其中每项包括：
    - id: number, SR 的 id
    - name： string, SR 的标题
    - description: string, SR 的内容

  Remark:

  匹配逻辑为 SR 的标题在 MR 的标题或正文中出现。

  ### GET /api/projects/:id/git/get-issue-caused-by-sr/:sr 

  提供某个 SR 的缺陷信息。标准为在 issue 内提到了这个 SR 的标题。

  params:

  + id: projectId,
  + sr: SR 编号

  returns:
  + 数组，其中每项为一个 Issue 信息，格式同 [get-issue](git#get-apiprojectsidgitget-issue)

  ### GET /api/projects/:id/git/get-issue-stat

  获取按照工程师的缺陷解决统计

  params:

  + id: projectId,


  returns:

  + 数组，其中每项包括
    - name: `string` gitlab 用户名
    - time：`number []` 每个 issue 的解决时间，单位 ms
    - openIssue: `number`, 尚未完成 issue 数量

  ### GET /api/projects/:id/git/get-merge-request-stat

  获取各个用户 MR 数量统计

  params:

  + id: projectId

  returns:

  + 数组，其中每项包括
    - name: `string` gitlab 用户名
    
    - mergeRequest: `number []` 用户 mergeRequest 数量

## 说明

。。。

