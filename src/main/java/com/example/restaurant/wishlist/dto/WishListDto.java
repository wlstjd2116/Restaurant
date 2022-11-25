package com.example.restaurant.wishlist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class WishListDto{

    private Integer index;
    private String title;                   //음식명, 장소명
    private String category;                //카테고리
    private String address;                 //주소
    private String roadAddress;             // 도로명
    private String homePageLink;            // 홈페이지 주소
    private String imageLink;               // 음식, 가게이미지 주소
    private int mapx;                       // 지도의 x값
    private int mapy;                       // 지도의 y값
    private boolean isVisit;                // 방문여부
    private int visitCount;                 // 방문 카운트

}
