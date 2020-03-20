/*
 * Copyright 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.greglturnquist.payroll;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner {

	private final ContestantRepository contestantRepository;
	private final GridItemRepository gridItemRepository;

	@Autowired
	public DatabaseLoader(ContestantRepository contestantRepository, GridItemRepository gridItemRepository) {
		this.contestantRepository = contestantRepository;
		this.gridItemRepository = gridItemRepository;
	}

	@Override
	public void run(String... strings) throws Exception {
//		load contestants

		Contestant c1 = new Contestant("Sarah", "Smith", "female");
		Contestant c2 = new Contestant("Mark", "Jones", "male");
		Contestant c3 = new Contestant("Amanda", "Abrams", "female");
		Contestant c4 = new Contestant("Lewis", "Wright", "male");
		this.contestantRepository.save(c1);
		this.contestantRepository.save(c2);

//		load gridItems
		GridItem g1 = new GridItem(c1, c2);
		this.gridItemRepository.save(g1);


	}
}
// end::code[]