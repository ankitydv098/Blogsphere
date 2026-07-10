package com.blogsphere.api.dto.response;

import lombok.*;

import java.util.List;

/**
 * Paginated response wrapper for list-based API responses.
 *
 * <p>Wraps any list of content with pagination metadata so clients
 * can implement proper pagination controls.</p>
 *
 * @param <T> type of items in the page
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponse<T> {

    /** The list of items on this page. */
    private List<T> content;

    /** Zero-based page number. */
    private int pageNumber;

    /** Number of items per page. */
    private int pageSize;

    /** Total number of items across all pages. */
    private long totalElements;

    /** Total number of pages. */
    private int totalPages;

    /** True if this is the last page. */
    private boolean lastPage;
}
