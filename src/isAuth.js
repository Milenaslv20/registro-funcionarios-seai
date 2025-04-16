import Axios from 'axios';

export const isAuth = async (nomeUsuario, senhaUsuario) => {
    try{
        const res = await Axios.post("http://172.20.43.250:5000/login", { nomeUsuario, senhaUsuario })
        if(res.data.sucess){
            return { sucess:true }
        }
        else{
            return { sucess:false }
        }
    }catch (err){
        console.log("erro")
        return { sucess:false }
    }
};