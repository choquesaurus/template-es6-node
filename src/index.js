require('@babel/polyfill');
require('@babel/register')({
    extends:'./.babelrc',
    ignore:[/node_modules/]
});
const handler='express';
require(`./handler/${handler}`);


