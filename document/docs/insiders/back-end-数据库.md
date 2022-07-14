---
template: overrides/main.html
title: insiders
---

数据库相关配置及记录
## 配置信息
### 开发用数据库（dev）
```json
{
    "type": "postgres",
    "host": "postgres.ScissorSeven.secoder.local",
    "port": 5432,
    "username": "counter-prod",
    "password": "******",
    "database": "counter-prod",
    "synchronize": true
}
```
### 部署用数据库（master）
```json
{
    "type": "postgres",
    "host": "MasterDatabase.ScissorSeven.secoder.local",
    "port": 5432,
    "username": "mainuser",
    "password": "******",
    "database": "masterdb",
    "synchronize": true
}
```
## 配置记录
1. 创建容器
2. 建立存储卷，挂载在/var/lib/postgresql/data下
3. 暴露5432端口
4. 进入终端初始化数据库
5. 添加配置，配置项为config-backend-dev

## 数据库基本操作命令

从终端进入数据库：\psql -U [username] -d [database-name]

查看所有表项：\dt

查看某个表项的所有列的属性：\d [table-name]

查看某个表项的内容：select * from [table-name];

其余和数据库sql命令基本一致

* 注意加分号
* 注意user不能直接查看（与原有的user表冲突了）

创建新用户：createuser -P -U [username] --interactive

创建新仓库：createdb -U [root-name] -O [username] [databasename]

数据库迁移：

* 生成迁移文件：yarn typeorm migration:generate -n Apple -d src/migration
* 执行迁移：yarn typeorm migration:run
* 其余命令有:show, :create, :revert

清空某个表项：

```sql
truncate table [table-name];
alter sequence [seq-name] start 1;
```

## 表项
### 用户表项

| 名称        | 类型      | 说明                     | 备注                |
| ----------- | --------- | ------------------------ | ------------------- |
| id          | number    | 用户id                   | primary key, unique |
| username    | string    | 用户的用户名             | unique              |
| password    | string    | 用户登录使用的密码       |                     |
| salt        | string    | 密码盐                   |                     |
| ownProjects | Project   | 自己作为负责人的项目     | OneToMany           |
| devProjects | Project[] | 自己作为开发工程师的项目 | ManyToMany          |
| sysProjects | Project[] | 自己作为系统工程师的项目 | ManyToMany          |
| qaProjects  | Project[] | 自己作为负责人的项目     | ManyToMany          |

### 项目表项

| 名称                      | 类型   | 说明               | 备注                |
| ------------------------- | ------ | ------------------ | ------------------- |
| id                        | number | 项目id             | primary key, unique |
| name                      | string | 项目名称           |                     |
| description               | string | 项目描述           | optional            |
| manager                   | User   | 项目负责人         | ManyToOne           |
| systemEngineers           | User[] | 项目中的系统工程师 | ManyToMany          |
| developmentEngineers      | User[] | 项目中的开发工程师 | ManyToMany          |
| qualityAssuranceEngineers | User[] | 项目中的QA工程师   | ManyToMany          |

### 原始需求表项

| 名称              | 类型          | 说明       | 备注                |
| ----------------- | ------------- | ---------- | ------------------- |
| id                | number        | 原始需求id | primary key, unique |
| description       | string        | 需求的描述 |                     |
| state             | Enum\<State\> | 需求的状态 |                     |
| deliveryIteration | Iteration     | 交付迭代   | OneToOne            |