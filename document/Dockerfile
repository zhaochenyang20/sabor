# Stage 1: build

FROM python:3.7

ENV BUILD=/opt/build

WORKDIR $BUILD

RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple mkdocs mkdocs-material mkdocs-minify-plugin mkdocs-redirects

COPY . $BUILD

RUN mkdocs build

# Stage 2

FROM nginx:1.18.0

ENV HOME=/opt/app

WORKDIR $HOME

COPY --from=0 /opt/build/site dist
COPY nginx/ nginx/

RUN rm -r /etc/nginx/conf.d \
    && ln -s $HOME/nginx /etc/nginx/conf.d

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80


