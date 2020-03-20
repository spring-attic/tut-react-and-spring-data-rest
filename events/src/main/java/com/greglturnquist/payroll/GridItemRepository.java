package com.greglturnquist.payroll;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Greg Turnquist
 */
// tag::code[]
public interface GridItemRepository extends PagingAndSortingRepository<GridItem, Long> {

}
// end::code[]
