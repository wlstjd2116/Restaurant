package com.example.restaurant.wishlist.repository;

import com.example.restaurant.db.MemoryDbEntity;
import com.example.restaurant.db.MemoryDbRepositoryAbstract;
import com.example.restaurant.wishlist.entity.WishListEntity;
import org.springframework.stereotype.Repository;

@Repository // DB로 사용하겠다는 의미의 annotation
public class WishListRepository extends MemoryDbRepositoryAbstract<WishListEntity> {

}
