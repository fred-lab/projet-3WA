export default function (Vue) {
    Vue.auth = {
        setToken(token, expiration){
            sessionStorage.setItem('access_token', token)
            sessionStorage.setItem('expires_in', expiration + Date.now())
        },
        getToken(){
            const token = sessionStorage.getItem('access_token')
            const expiration = sessionStorage.getItem('expires_in')

            if( !token || !expiration ){
                return null
            }
            else if(Date.now() > parseInt(expiration)){
                this.destroyToken()
                return null
            }
            else{
                return token
            }
        },
        destroyToken(){
            sessionStorage.removeItem('access_token')
            sessionStorage.removeItem('expires_in')
        },
        isAuthenticated(){
            return (this.getToken()) ? true : false
        }
    }
    Object.defineProperties(Vue.prototype, {
        $auth : {
            get: _=> Vue.auth
        }
    })
}