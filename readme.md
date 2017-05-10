## 项目说明   
本项目是对regularjs的简易实现，目前只实现了两点：   
1,解析`<div>{text}<div>`，其中包括`div`这种元素类型，及`{text}`这种简单的expression类型。   
2,在改变数据后，用 $update 进行更新的功能。   
    
涉及 Walker、watcher、lexer、ast等核心概念，及reguarjs的项目基本结构与实现原理。