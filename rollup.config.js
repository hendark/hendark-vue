import babel from 'rollup-plugin-babel'
export default{
    input:'./src/core/instance/index.js',
    output:{
        file:'./dist/vue.js',
        name:'Vue',
        format:'umd',
        sourcemap:true 
    },
    plugins:[
        babel({
            exclude:'node_modules/**'
        })
    ]
}