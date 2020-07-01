const errorHandle = {
    error: function(app, logger) {
        // handle server error
        app.use(async (ctx, next) => {
            try {
                await next();
            } catch (error) {
                logger.error(error);
                ctx.status = 500;
                ctx.body = "500 - 服务器端异常";
            }
        });

        // handle 404
        app.use(async(ctx, next) => {
            await next();
            if (ctx.status === 404) {
                ctx.status = 404;
                ctx.body = "404 - 没有找到对应的资源";
            }
        })
    }
}

module.exports = errorHandle;