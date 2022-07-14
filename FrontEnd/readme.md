# Readme

## 前端人员架构

- 赵晨阳——A
- 程子睿——B
- 赵光宇——C

## 配置

- [React](https://zh-hans.reactjs.org/) + [Bootstrap](https://www.bootcss.com/)

- [Docker](https://dockerdocs.cn/)

- [ESLint](https://cn.eslint.org/)

# Issue

- 每次提出 issue 前，先在此处讨论

## 语义约定

### 需求规范
- 将IR拆解为SR
- IR的拆解由前后端商讨决定

### IR为原始需求
- IR为用户提出的需求，在粒度上不严格定义大小
- IR有不重复的编号

### SR为功能需求
- SR要求具有可测试性，粒度不应过细
- 对于内部非功能需求也需要分解SR

### 配置需求
- 各项配置与项目初始化并非原始需求
- 并非原始需求列表所列出的项目的分解使用编号`INT 000`
- 其中`INT 001-006`按照例会纪要所列执行

### 分支规范
- 每次写代码先pull最新的代码，然后开新分支
- 写完了之后及时合并，等待部署完成后所有的代码都合并进入dev，确保无误后再并入master并部署至服务器

### MR规范

#### 需求完成：
- Requirement: SR.001.001 + 功能说明
```bash
 git merge --no-ff -m "Requirement: SR.001.002: CI/CD config, ESLint config"
```
> 表示本次合并的代码实现了需求 SR.001.002，配置了 CI/CD 和 ESLint

#### 修复漏洞
- Bugfix: Issue #001 + Bug 说明
```bash
git merge --no-ff -m "Bugfix: Issue #001 wrong url config"
```
> 表示本次合并的代码修复了 Bug Issue #001 ，解决了错误的 url 配置

## 注意事项

### 任务分配
- 所有任务都应该使用 GitLab 内的 Issue 功能来提出并分配给成员
- Issue的完成时间预估与记录、与Commit的关联，见[GitLab文档](https://docs.secoder.net/service/gitlab/)
- 每名成员在每一时间段都应该有任务（合理的窗口期应短于<b>三天</b>），每个任务都应被及时完成（合理的完成时间应短于<b>两周</b>）

### 工作质量
- 提交的粒度不宜过粗（有效的提交增加行数和删除行数之和不应超过<b>200行</b>）
- 对提交内容进行充分说明（定义提交信息字符数不足<b>20个</b>的提交为无效的）
- 合理的提交间隔，一天交一次

### 分支管理
- MYOC (Merge Your Own Code)
- 一个分支只做一件事情，及时合并

### 工作流程
- 飞书用于记录例会与版本日志
- 通信协议，具体需求写在前后端各自的 readme
- 分解需求后，将 SR 写入 readme，然后在 gitlab 的 issue 里提出
- 完成功能后，将 issue close 掉

## week 4

1. INT 001 初始化 React 项目——A
2. INT 002 配置前端 CI/CD 与 ESLint——B
3. INT 003 配置前端 docker——C
4. INT 004 编写前端文档，调整前端文件树——A
4. INT 005 根据调整后的前端文件树重新编写CI/CD 与 ESLint——B


