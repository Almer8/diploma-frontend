export function avatarPath (avatarPath){
    if(!avatarPath){ return null}
    return (avatarPath.replace("D:\\Java\\diploma-filestorage\\avatars\\", "http://localhost:8080/avatars/"))
}
