export default class Component{
    state = {}
    setState(params){
        this.state = {...this.state, ...params}
    }
    update(){}
    render(){}
}