package com.blogsphere.api.repository;

import com.blogsphere.api.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for {@link Category} entity.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Check whether a category with the given name already exists.
     *
     * @param categoryName the category name to check
     * @return true if the category already exists
     */
    boolean existsByCategoryName(String categoryName);
}
