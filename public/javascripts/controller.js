var socket;
angular.module("controllers",["services"])
.controller("index",["$scope","$http",function($scope,$http){
    $http({url:"/ajaxNews"}).then(function(data){
        $scope.data=data.data;
    })
}]).controller("show",["$scope","$http","$routeParams",function($scope,$http,$routeParams){
    var id=$routeParams.id;
    $http({url:"/ajaxNewsCon?id="+id}).then(function(data){
        $scope.con=data.data.con;
    })

    /*在多个页面共享数据 services*/
}]).controller("lunbo",function(){
    var mySwiper = new Swiper('.swiper-container', {
        loop :true,
        autoplay: 3000,
        freeMode : false,
        autoplayDisableOnInteraction : false,
        pagination : '.swiper-pagination',
        paginationClickable :true,
        zoom : true,
    });
}).controller("phone",["$scope","$http","$filter",function($scope,$http,$filter) {
    $http({url:"/ajaxPhone"}).then(function(data){
        var data=data.data;
        var arr=[];
        for(var i=0;i<data.length;i++){
            var current=[];
            for(var j=1;j<data.length;j++){
                if((data[i].en==data[j].en)&&!data[j].flag){
                    data[j].flag=true;
                    current.push(data[i]);
                    current.en=data[i].en;
                }
            }
            if(current.length>0){
                arr.push(current);
                var arr=$filter("orderBy")(arr,"en");
            }
        }
        $scope.data=arr;
        console.log($scope.data);
        $scope.type="";
        $scope.filter=function(en){
            $scope.type=en;
        }
        $scope.show=function(){
            $scope.type="";
        }

        var placeholder=document.querySelector(".mui-placeholder");
        var input=document.querySelector(".mui-input-clear");
        placeholder.onclick=function(){
            this.style.width="20px";
            input.focus();
        }
        input.onblur=function(){
            placeholder.style.width="100%";
        }
    })


}]).controller("todo",["$scope","todoData",function($scope,todoData){
    $scope.data=todoData;
    $scope.del=function(id){
        for(var i=0;i<$scope.data.length;i++){
            if($scope.data[i].id==id){
                $scope.data.splice(i,1);
            }
        }
        localStorage.todo=JSON.stringify($scope.data);
    }
}]).controller("todoadd",["$scope","todoData",function($scope,todoData){
    $scope.data=todoData;
    //todo保存
    $scope.save=function(){
        var con=document.quterySelector(".todocon").innerHTML.replace(/\s*/g,"");
        if(!con){
            alert("内容不能为空");
            return;
        }
        var conObj={con:con,id:getMaxId($scope.data)+1};
        $scope.data.push(conObj);
        localStorage.todo=JSON.stringify($scope.data);
        location.href="#!/todo";
    }
    //todo关闭
    $scope.close=function(){
        var con=document.querySelector(".todocon").innerHTML.replace(/\s*/g,"");
        var yes=window.confirm("确认关闭吗？");
        if(yes){
            location.href="#!/todo";
        }
    }
    function getMaxId(con){
        return con.length>0?con.sort(function(a,b){
            return a.id>b.id;
        })[con.length-1].id:0;
    }
}]).controller("edit",["$scope","todoData","$routeParams",function($scope,todoData,$routeParams){
    var id=$routeParams.id;

    $scope.data=todoData;
    for(var i=0;i<$scope.data.length;i++){
        if($scope.data[i].id==id){
            $scope.current=$scope.data[i];
        }
    }

    $scope.save=function(){
        var con=document.querySelector(".todocon").innerHTML.replace(/\s*/g,"");
        //修改为空
        if(!con){
            for(var i=0;i<$scope.data.length;i++){
                if($scope.data[i].id==id){
                    $scope.data.splice(i,1);
                }
            }
        }else{//不为空
            for(var i=0;i<$scope.data.length;i++){
                if($scope.data[i].id==id){
                    $scope.data[i].con=con;
                }
            }
        }
        localStorage.todo=JSON.stringify($scope.data);
        location.href="#!/todo";
    }

    //todo关闭
    $scope.close=function(){
        var con=document.querySelector(".todocon").innerHTML.replace(/\s*/g,"");
        var yes=window.confirm("确认关闭吗？");
        if(yes){
            location.href="#!/todo";
        }
    }

}]).controller("liaotian",["$scope","$http","$filter",function($scope,$http,$filter){
    socket=io('http://localhost:8080');
    var name,id;
    socket.on('connect',function(){
        socket.emit("event",{name:name,id:id});
    });
    socket.on("event",function(data){
        for(var i in data){
            for(var j=1;j<$scope.data.length;j++){
                if(($scope.data[j].flag)){
                    continue;
                }
                if((data[i].id==$scope.data[j].id)){
                    $scope.data[j].flag=true;
                    $scope.data[j].flag1=true;
                    $scope.data[j].url="#!/liao/"+data[i].id;
                }else{
                    $scope.data[j].url="javascript:;"
                }
            }
        }
        $scope.$apply(function(){

        })
        console.log($scope.data);
        console.log(1111);
    })
    $http({url:"/ajaxPhone"}).then(function(data){
        //所有联系人信息
        var data=data.data;
        name=data[0].name;
        socket.name=name;
        id=data[0].id;
        $scope.data=data;
        $scope.type="";
        $scope.filter=function(en){
            $scope.type=en;
        };
        $scope.show=function(){
            $scope.type="";
        };
        var placeholder=document.querySelector(".mui-placeholder");
        var input=document.querySelector(".mui-input-clear");
        placeholder.onclick=function(){
            this.style.width="20px";
            input.focus();
        };
        input.onblur=function(){
            placeholder.style.width="100%";

        }
    })
}]).controller("liao",function($scope,$routeParams){
    var id=$routeParams.id;
    var text=document.querySelector("textarea");
    var history=document.querySelector(".history");
    $scope.message=[];
    $scope.click=function(){
        $scope.message.push({text:text.value,self:socket.name});
        socket.emit("one",{text:text.value,id:id,self:socket.name});
    }
    socket.on("one",function(data){
        console.log(1111111);
        $scope.$apply(function(){
            $scope.message.push({text:data.text,self:data.self});
        })
    })
})






