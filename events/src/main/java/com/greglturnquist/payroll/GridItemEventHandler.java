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
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@Component
@RepositoryEventHandler(GridItem.class) // <1>
public class GridItemEventHandler {

    private final SimpMessagingTemplate websocket; // <2>

    private final EntityLinks entityLinks;

    @Autowired
    public GridItemEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
        this.websocket = websocket;
        this.entityLinks = entityLinks;
    }


    /**
     * Take an {@link Contestant} and get the URI using Spring Data REST's {@link EntityLinks}.
     *
     * @param gridItem
     */
    private String getPath(GridItem gridItem) {
        return this.entityLinks.linkForItemResource(gridItem.getClass(),
                gridItem.getId()).toUri().getPath();
    }

}
// end::code[]
