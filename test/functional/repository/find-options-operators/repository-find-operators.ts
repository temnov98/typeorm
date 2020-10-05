import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {
    Any,
    Between,
    Connection,
    Equal,
    In,
    IsNull,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Not
} from "../../../../src";
import {Post} from "./entity/Post";
import {PostgresDriver} from "../../../../src/driver/postgres/PostgresDriver";
import {CockroachDriver} from "../../../../src/driver/cockroachdb/CockroachDriver";
import {Raw} from "../../../../src/find-options/operator/Raw";
import {PersonAR} from "./entity/PersonAR";
import {expect} from "chai";

describe("repository > find options > operators", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("not", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not("About #1")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("lessThan", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: LessThan(10)
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("lessThanOrEqual", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);
        const post3 = new Post();
        post3.title = "About #3";
        post3.likes = 13;
        await connection.manager.save(post3);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: LessThanOrEqual(12)
        });
        loadedPosts.should.be.eql([
            { id: 1, likes: 12, title: "About #1" },
            { id: 2, likes: 3, title: "About #2" }
        ]);

    })));

    it("not(lessThan)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(LessThan(10))
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("not(lessThanOrEqual)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);
        const post3 = new Post();
        post3.title = "About #3";
        post3.likes = 13;
        await connection.manager.save(post3);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(LessThanOrEqual(12))
        });
        loadedPosts.should.be.eql([{ id: 3, likes: 13, title: "About #3" }]);

    })));

    it("moreThan", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: MoreThan(10)
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("moreThanOrEqual", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);
        const post3 = new Post();
        post3.title = "About #3";
        post3.likes = 13;
        await connection.manager.save(post3);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: MoreThanOrEqual(12)
        });
        loadedPosts.should.be.eql([
            { id: 1, likes: 12, title: "About #1" },
            { id: 3, likes: 13, title: "About #3" }
        ]);

    })));

    it("not(moreThan)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(MoreThan(10))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(moreThanOrEqual)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);
        const post3 = new Post();
        post3.title = "About #3";
        post3.likes = 13;
        await connection.manager.save(post3);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(MoreThanOrEqual(12))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("equal", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Equal("About #2")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(equal)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(Equal("About #2"))
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("like", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Like("%out #%")
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }, { id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(like)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(Like("%out #1"))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("between", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts1 = await connection.getRepository(Post).find({
            likes: Between(1, 10)
        });
        loadedPosts1.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

        const loadedPosts2 = await connection.getRepository(Post).find({
            likes: Between(10, 13)
        });
        loadedPosts2.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

        const loadedPosts3 = await connection.getRepository(Post).find({
            likes: Between(1, 20)
        });
        loadedPosts3.should.be.eql([{ id: 1, likes: 12, title: "About #1" }, { id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(between)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts1 = await connection.getRepository(Post).find({
            likes: Not(Between(1, 10))
        });
        loadedPosts1.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

        const loadedPosts2 = await connection.getRepository(Post).find({
            likes: Not(Between(10, 13))
        });
        loadedPosts2.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

        const loadedPosts3 = await connection.getRepository(Post).find({
            likes: Not(Between(1, 20))
        });
        loadedPosts3.should.be.eql([]);
    })));

    it("in", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: In(["About #2", "About #3"])
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(in)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(In(["About #1", "About #3"]))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("any", () => Promise.all(connections.map(async connection => {
        if (!(connection.driver instanceof PostgresDriver))
            return;

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Any(["About #2", "About #3"])
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(any)", () => Promise.all(connections.map(async connection => {
        if (!(connection.driver instanceof PostgresDriver))
            return;

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(Any(["About #2", "About #3"]))
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("isNull", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = null as any;
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: IsNull()
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: null }]);

    })));

    it("not(isNull)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = null as any;
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(IsNull())
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("raw", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Raw("12")
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("raw (function)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Raw(columnAlias => "1 + " + columnAlias + " = 4")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);
    })));

    it("raw (function with parameters)", () => Promise.all(connections.map(async connection => {
        const createPost = (index: number): Post => {
            const post = new Post();
            post.title = `About #${index}`;
            post.likes = index;

            return post;
        }

        // insert some fake data
        await connection.manager.save([
            createPost(1),
            createPost(2),
            createPost(3),
            createPost(4),
            createPost(5),
            createPost(6),
        ]);

        // check operator
        const result1 = await connection.getRepository(Post).find({
            likes: Raw((columnAlias, parameters) => {
                return `(${columnAlias} = ${parameters[0]}) OR (${columnAlias} = ${parameters[1]})`
            }, [2, 3]),
        });
        result1.should.be.eql([
            { id: 2, likes: 2, title: "About #2" },
            { id: 3, likes: 3, title: "About #3" },
        ]);

        // check operator
        const result2 = await connection.getRepository(Post).find({
            likes: Raw((columnAlias, parameters) => {
                return `(${columnAlias} IN (1, 4, 5, 6)) AND (${columnAlias} < ${parameters[0]})`
            }, [6]),
        });
        result2.should.be.eql([
            { id: 1, likes: 1, title: "About #1" },
            { id: 4, likes: 4, title: "About #4" },
            { id: 5, likes: 5, title: "About #5" },
        ]);

        // check operator
        const result3 = await connection.getRepository(Post).find({
            title: Raw((columnAlias, parameters) => {
                return `${columnAlias} IN (${parameters[0]}, ${parameters[1]}, ${parameters[2]})`;
            }, ["About #1", "About #3", "About #5"]),
            likes: Raw((columnAlias, parameters) => `${columnAlias} IN (${parameters[0]}, ${parameters[1]})`, [5, 1]),
        });
        result3.should.be.eql([
            { id: 1, likes: 1, title: "About #1" },
            { id: 5, likes: 5, title: "About #5" },
        ]);

        // check ANY() for Postgres and Cockroach
        if ((connection.driver instanceof PostgresDriver) || (connection.driver instanceof CockroachDriver)) {
            // check operator
            const result4 = await connection.getRepository(Post).find({
                likes: Raw((columnAlias, parameters) => {
                    return `(${columnAlias} = ANY(${parameters[0]})) AND (${columnAlias} < ${parameters[1]})`
                }, [[1, 4, 5, 6], 6]),
            });
            result4.should.be.eql([
                { id: 1, likes: 1, title: "About #1" },
                { id: 4, likes: 4, title: "About #4" },
                { id: 5, likes: 5, title: "About #5" },
            ]);
            
            // check operator
            const result5 = await connection.getRepository(Post).find({
                title: Raw((columnAlias, parameters) => {
                    return `${columnAlias} = ANY(${parameters[0]})`;
                }, [["About #1", "About #3", "About #5"]]),
                likes: Raw((columnAlias, parameters) => `${columnAlias} IN (${parameters[0]}, ${parameters[1]})`, [5, 1]),
            });
            result5.should.be.eql([
                { id: 1, likes: 1, title: "About #1" },
                { id: 5, likes: 5, title: "About #5" },
            ]);
        }
    })));

    it("raw (function with object literal parameters)", () => Promise.all(connections.map(async connection => {
        const createPost = (index: number): Post => {
            const post = new Post();
            post.title = `About #${index}`;
            post.likes = index;

            return post;
        }

        // insert some fake data
        await connection.manager.save([
            createPost(1),
            createPost(2),
            createPost(3),
            createPost(4),
            createPost(5),
            createPost(6),
        ]);

        // check operator
        const result1 = await connection.getRepository(Post).find({
            likes: Raw((columnAlias) => {
                return `(${columnAlias} = :value1) OR (${columnAlias} = :value2)`
            }, { value1: 2, value2: 3 }),
        });
        result1.should.be.eql([
            { id: 2, likes: 2, title: "About #2" },
            { id: 3, likes: 3, title: "About #3" },
        ]);

        // check operator
        const result2 = await connection.getRepository(Post).find({
            likes: Raw((columnAlias) => {
                return `(${columnAlias} IN (1, 4, 5, 6)) AND (${columnAlias} < :maxValue)`
            }, { maxValue: 6 }),
        });
        result2.should.be.eql([
            { id: 1, likes: 1, title: "About #1" },
            { id: 4, likes: 4, title: "About #4" },
            { id: 5, likes: 5, title: "About #5" },
        ]);

        // check operator
        const result3 = await connection.getRepository(Post).find({
            title: Raw((columnAlias) => {
                return `${columnAlias} IN (:a, :b, :c)`;
            }, { a: "About #1", b: "About #3", c: "About #5" }),
            likes: Raw((columnAlias) => `${columnAlias} IN (:d, :e)`, { d: 5, e: 1 }),
        });
        result3.should.be.eql([
            { id: 1, likes: 1, title: "About #1" },
            { id: 5, likes: 5, title: "About #5" },
        ]);

        // check operator
        const result4 = await connection.getRepository(Post).find({
            likes: Raw((columnAlias) => `${columnAlias} IN (2, 6)`, { }),
        });
        result4.should.be.eql([
            { id: 2, likes: 2, title: "About #2" },
            { id: 6, likes: 6, title: "About #6" },
        ]);
    })));


    it("should work with ActiveRecord model", async () => {
        // These must run sequentially as we have the global context of the `PersonAR` ActiveRecord class
        for (const connection of connections) {
            PersonAR.useConnection(connection);

            const person = new PersonAR();
            person.name = "Timber";
            await connection.manager.save(person);

            const loadedPeople = await PersonAR.find({
                name: In(["Timber"])
            });
            expect(loadedPeople[0].name).to.be.equal("Timber");
        }
    });

});
