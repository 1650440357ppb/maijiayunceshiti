angular.module("myapp",[])
    .controller("phone",["$scope","$http","$filter",function($scope,$http,$filter){
        $http({url:"/ajax"}).then(function(data){
            var data=data.data;
            var arr=[];
            for(var i=0;i<data.length;i++){
                var current=[];
                for(var j=1;j<data.length;j++){
                    if((data[i].en==data[j].en)&&!data[j].flag){
                        data[j].flag=true;
                        if(data[i].name!=data[j].name){
                            if((i==0)&&!data[0].flag){
                                data[0].flag=true;
                                current.push(data[0]);
                                current.push(data[j]);
                                current.en=data[i].en;
                            }else{
                                current.push(data[j]);
                                current.en=data[i].en;
                            }

                        }else{
                            current.push(data[i]);
                            current.en=data[i].en;
                        }

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
        })
    }]);