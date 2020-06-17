describe("Blog app", function() {
	beforeEach(function() {
		cy.request("POST", "http://localhost:3001/api/testing/reset");
		const user = {
			name: "Matti Lukkainen",
			username: "mluukkai",
			password: "salainen"
		};
		cy.request("POST", "http://localhost:3001/api/users", user);
		cy.visit("http://localhost:3000");
	});

	it("Front page can be opened", function() {
		cy.contains("login");
		cy.contains("Log in to see blogs");
	})

	it("login form is shown", function() {
		cy.contains("username");
		cy.get("form").should("contain", "username");
		cy.get("form").should("contain", "password");
	})

	describe("Login", function() {
		it("succeeds with correct credentials", function() {
			cy.contains("Login").click();
			cy.get("#username").type("mluukkai");
			cy.get("#password").type("salainen");
			cy.get("#login-button").click();
			cy.contains("Logged in as Matti Lukkainen");

		});
		
		it("fails with wrong credentials", function() {
			cy.contains("Login").click();
			cy.get("#username").type("nogo");
			cy.get("#password").type("salainen");
			cy.get("#login-button").click();

			cy.contains("Invalid username or password.");
			cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
		});
	});

	describe("When logged in", function() {
		beforeEach(function() {
			cy.login({ username: "mluukkai", password: "salainen" });
			cy.createBlog({
				title: "Icke habe grad den Blogpost erstellt und kann ihn wieder löschen.",
				author: "Me",
				url: "www.me.de",
				likes: 0,
			})
		});

		it("A blog can be created", function() {
			cy.contains("Create new blog").click();
			cy.get("#author").type("Haruki Murakami");
			cy.get("#title").type("Mister Aufziehvogel rockt das Haus");
			cy.get("#url").type("www.japan.jp");
			cy.contains("Create post").click();

			cy.contains('Blog with title "Mister Aufziehvogel rockt das Haus" saved.');
		});

		it("The user can delete his blogpost", function() {
			cy.contains("Icke habe grad den Blogpost erstellt und kann ihn wieder löschen.")
				.parent()
				.contains("view")
				.click();

			cy.contains("Delete").click();
			cy.contains("Icke habe grad den Blogpost erstellt und kann ihn wieder löschen. was deleted.");
		});

		describe("And a blog exists", function() {
			beforeEach(function() {
				cy.createBlog({
					title: "Dieser Blogpost war schon da",
					author: "Teddy Roosevelt",
					url: "www.roosevelt.de",
					likes: 0
				});
			});

			it("A user can like a blog", function() {
				cy.contains("view").click();
				cy.contains("Like").click();
				cy.get(".likes").should("contain", "Likes: 1");
			});
		});

		describe("And several blogs exists", function(){
			beforeEach(function(){
				cy.createBlog({
					title: "Should be 2nd.",
					author: "John F. Kennedy",
					url: "www.werder.de",
					likes: 4,
				});
				cy.createBlog({
					title: "Should be 1st.",
					author: "Barack Obama",
					url: "www.gmx.de",
					likes: 5,
				});
				cy.createBlog({
					title: "Should be 3rd.",
					author: "Barack Obama",
					url: "www.gmx.de",
					likes: 1,
				})
			})

			it("Blogs are ordered by number of likes", function(){
				cy.get(".blog").then(blogs => {
					cy.wrap(blogs[0]).contains("Should be 1st.");
					cy.wrap(blogs[1]).contains("Should be 2nd.");
					cy.wrap(blogs[2]).contains("Should be 3rd.");
					cy.wrap(blogs[3]).contains("Icke habe grad den Blogpost erstellt und kann ihn wieder löschen.");
				})
			})
		})
	});
});
