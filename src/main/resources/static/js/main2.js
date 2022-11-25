(function ($) {

    var search_check = 0;
    var road_list = []
    var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
    var geocoder = new kakao.maps.services.Geocoder();
    var road_latlng_list = []
    var testData = JSON.stringify(road_latlng_list);

    // 검색 결과 vue object
    var search_result = new Vue({
        el: '#search-result',
        data: {
            search_result : {}
        },
        method: {
            wishButton: function (event) {
                console.log("add");
            }
        }
    });

    // 맛집 목록 vue object
    var wish_list = new Vue({
        el: '#wish-list',
        data: {
            wish_list : {}
        },
        methods: {
            addVisit: function (index) {
                $.ajax({
                    type: "POST" ,
                    async: true ,
                    url: `/api/restaurant/${index}`,
                    timeout: 3000
                });

                getWishList();
            },
            deleteWish: function (index) {
                $.ajax({
                    type: "DELETE" ,
                    async: true ,
                    url: `/api/restaurant/${index}`,
                    timeout: 3000
                });
                getWishList();
            }
        }
    });
    //첫 번째 kakao 지도 생성 ======================
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
        mapOption = {
            center: new kakao.maps.LatLng(37.3595704, 127.105399), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

// 지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);

// 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // search
    $("#searchButton").click(function () {
        getData();
    });

    // Enter
    $("#searchBox").keydown(function(key) {
        if (key.keyCode === 13) {
            getData();
            console.log("getData() start");
        }
    });

    function getData(callback){
        return new Promise(function (resolve, reject){
            setTimeout(function (){
                const query = $("#searchBox").val();
                $.get(`/api/restaurant/search?query=${query}`, function (search_response) {
                    if(search_response){
                        search_result.search_result = search_response;
                        $('#search-result').attr('style','visible');
                        resolve(search_response);
                    }
                    reject(new Error("Request is failed"));
                })
            });
        }).then(function (tabledata){
            var place_JSON = JSON.stringify(search_result.search_result);
            var place_data = JSON.parse(place_JSON);
            var place = place_data.roadAddress; //도로명 받아옴

            console.log("searachButton load roadAddress : "+place);

            var mapContainer = document.getElementById('map'), // 지도를 표시할 div
                mapOption = {
                    center: new kakao.maps.LatLng(37.3595704, 127.105399), // 지도의 중심좌표
                    level: 1 // 지도의 확대 레벨
                };

// 지도를 생성합니다
            var map = new kakao.maps.Map(mapContainer, mapOption);

// 주소-좌표 변환 객체를 생성합니다
            var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다
            geocoder.addressSearch(place, function(result, status) {

                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {

                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 결과값으로 받은 위치를 마커로 표시합니다
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: coords
                    });

                    // 인포윈도우로 장소에 대한 설명을 표시합니다
                    var infowindow = new kakao.maps.InfoWindow({
                        content: '<div style="width:100px;text-align:center;padding:6px 0;">'+place_data.title+'</div>'
                    });
                    infowindow.open(map, marker);

                    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                    map.setCenter(coords);
                }
            });
        }).catch(function (err){
            console.log(err);
        });
    }

// wishlist marker에 사용할 위도경도 JSON 매핑
    function LoadingLatLng(){
        getWishList();
        for (var i = 0; i < road_list.length; i ++) {
            var data = new Object(); // data Object 생성
            geocoder.addressSearch(road_list[i], function(result, status) {

                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {

                    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                    data.title = "텃밭";
                    data.latlng = new kakao.maps.LatLng(coords.Ma, coords.La);

                    road_latlng_list.push(data);
                    console.log("road_latlng_list.push 후 : "+ road_latlng_list.length);
                    load_wish_map();

                    // 완료된 요소 반환
                    road_list.shift();
                }
                else{
                    road_latlng_list.push("실패했음");
                }
            });
        }
    }

    // my_list_map load
    function load_wish_map(){
        var mapContainer2 = document.getElementById('my_list_map'), // 지도를 표시할 div
            mapOption2 = {
                center: new kakao.maps.LatLng(37, 127), // 지도의 중심좌표
                level: 1 // 지도의 확대 레벨
            };
        var map2 = new kakao.maps.Map(mapContainer2, mapOption2); // 지도를 생성합니다
        for (var i = 0; i < road_latlng_list.length; i ++) {

            console.log("for문 실행");

            // 마커 이미지의 이미지 크기 입니다
            var imageSize = new kakao.maps.Size(24, 35);

            // 마커 이미지를 생성합니다
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                map: map2, // 마커를 표시할 지도
                position: road_latlng_list[i].latlng, // 마커를 표시할 위치
                title : road_latlng_list[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                image : markerImage // 마커 이미지
            });
            console.log(road_latlng_list[i].latlng.Ma, road_latlng_list[i].latlng.La);
            console.log(road_latlng_list[i].latlng);
            map2.panTo(new kakao.maps.LatLng(road_latlng_list[i].latlng.Ma, road_latlng_list[i].latlng.La));
        }
    }

    //wishMap, wishList 구현
    function getWishAndMap(){
        return new Promise(function (resolve, reject){
            setTimeout(function (){
                $.ajax({
                    type: "POST" ,
                    async: true ,
                    url: "/api/restaurant",
                    timeout: 3000,
                    data: JSON.stringify(search_result.search_result),
                    contentType: "application/json",
                    error: function (request, status, error) {

                    },
                    success: function (response, status, request) {
                        getWishList();
                    }
                });
                LoadingLatLng();
                console.log("getWishAndMap 함수 내의 road_latlng_list 길이"+road_latlng_list.length);
                if (road_latlng_list){
                    resolve(search_result.search_result);
                }
                reject(new Error("Error"));
            });
        });/*.then(function (tabledata){
            load_wish_map();
        }).catch(function (err){
            console.log(err);
        });*/
    }
    $("#wishButton").click(function () {

        var place_JSON = JSON.stringify(search_result.search_result);
        var place_data = JSON.parse(place_JSON);
        var place = place_data.roadAddress;
        road_list.push(place);
        console.log(place);
        getWishAndMap();
    });




    function getWishList(){
        $.get(`/api/restaurant/all`, function (search_response) {
            wish_list.wish_list = search_response;
        });
    }

    $(document).ready(function () {
        console.log("init")
        getWishList();
        LoadingLatLng();

    });

})(jQuery);

