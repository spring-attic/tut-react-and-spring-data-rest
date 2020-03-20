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

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@Entity
public class Contestant {

	private @Id @GeneratedValue Long id;
	private String firstName;
	private String lastName;
	private String gender;

	private @Version @JsonIgnore Long version;

	private Contestant() {}

	public Contestant(String firstName, String lastName, String description) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.gender = description;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Contestant contestant = (Contestant) o;
		return Objects.equals(id, contestant.id) &&
			Objects.equals(firstName, contestant.firstName) &&
			Objects.equals(lastName, contestant.lastName) &&
			Objects.equals(gender, contestant.gender) &&
			Objects.equals(version, contestant.version);
	}

	@Override
	public int hashCode() {

		return Objects.hash(id, firstName, lastName, gender, version);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getDescription() {
		return gender;
	}

	public void setDescription(String description) {
		this.gender = description;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	@Override
	public String toString() {
		return "Employee{" +
			"id=" + id +
			", firstName='" + firstName + '\'' +
			", lastName='" + lastName + '\'' +
			", description='" + gender + '\'' +
			", version=" + version +
			'}';
	}
}
// end::code[]