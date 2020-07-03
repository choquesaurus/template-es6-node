require('@babel/polyfill');
require('@babel/register')({
    extends:'./.babelrc',
    ignore:[/node_modules/]
})
require('./app')
// const {array_to_elastic} = require('./app');
// module.exports={
//     array_to_elastic
// }
