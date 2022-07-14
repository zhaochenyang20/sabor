toc: 2

!!! attention "阅读说明"

    在阅读以下内容前，请确保您已经仔细阅读了[说明部分](index.md)的相关内容。

## POST `/api/users/register`

### 功能说明

用户注册。

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `username` | `string` | 注册的用户名，不能为空或重复 |
| `password` | `string` | 注册的密码，不能为空 |

!!! note "密码安全"
    
    在数据库中，密码将会以加盐哈希的方式进行存储。同时，为了防止密码在传输过程中遭到窃听或泄漏，前端也会对密码进行一次哈希后再传输给后端。

### 返回

注册成功时，返回

+ code: 200,
+ data: `"Registration success"`

若 `username` 为空，返回

+ code: 400,
+ data: `"Username check failed"`

若 `username` 重复，返回

+ code: 400,
+ data: 错误信息

若 `password` 为空，返回

+ code: 400,
+ data: `"Password check failed"`



## POST `/api/users/login`

### 功能说明

进行用户登录

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `username` | `string` | 登录用户名，不能为空 |
| `password` | `string` | 登录密码，不能为空 |

### 返回

正常情况下：

+ code: 200
+ data: `string`，表示用户的登录 token （之后称为用户 token）

登录失败时：

+ code: 401
+ data：`string`，失败信息

## GET `/api/users/testLogin`

需要登录

!!! note "登录认证"

    为了进行登录认证，需要在 HTTP Header 中加入表项：`Authorization: Bearer `+ 登录接口返回的用户 token（请注意两部分之间有一个空格）。
    
    需要注意的是，该 token 的有效期为 24 小时。

### 功能说明

验证用户是否登录

### 参数

无

### 返回

若用户正常登录（即在 Header 中有正确的 token 信息）

+ code: 200
+ data: 欢迎信息

认证失败时：

+ code: 401
+ data: 失败信息

## POST `/api/users/changePassword`

需要登录。

### 功能说明

修改密码

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `oldPassword` | `string` | 原密码，不能为空 |
| `newPassword` | `string` | 新密码，不能为空 |
  
### 返回

若修改成功

+ `code`: 200
+ `data`: 新的用户 token

原密码错误时：

+ `code`: 401
+ `data`: 错误信息

新密码为空时

+ `code`: 400
+ `data`: 错误信息

## GET `/api/users/find`

**需要登录**。

### 功能说明

查询所有用户。

### 参数

无

### 返回

+ code: 200,
+ data: 数组，其中每项包括
    - `id`: `number`，用户 `id`（后端自动生成）
    - `username`: `string`, 用户名

## POST `/api/users/find`

需要登录

### 功能

查找指定用户名或 id 的用户，二者均为可选，若二者均指定，则优先查找 username。

### 参数

| 参数名 | 类型 | 说明 |
| ----  | --- | --- |
| `username?` | `string` | 查找的用户名 |
| `id?` | `number` | 查找的 id |

### 返回

若用户存在

+ code: 200,
+ data: 包含两项
    - `id`: `number`, 用户 id
    - `username`: `string`,用户名

若用户不存在

+ code: 404
+ data: 错误信息
