CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"short_url" varchar(32) NOT NULL,
	"original_url" text NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "links_short_url_unique_index" ON "links" USING btree ("short_url");--> statement-breakpoint
CREATE INDEX "links_created_at_index" ON "links" USING btree ("created_at");
