const tryCatch = controller => (req, res, next) =>{
    try {
        controller(req, res);
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const tryCatchAsync = controller => async (req, res, next) => {
    try{

        await controller(req, res)
    }
    catch(err){
        console.log(err)
        next(err)

    }
}
module.exports = {tryCatch, tryCatchAsync}