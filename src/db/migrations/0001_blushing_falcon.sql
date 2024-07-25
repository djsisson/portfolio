ALTER TABLE "upgrade_required_research" RENAME COLUMN "research_id" TO "required_id";--> statement-breakpoint
ALTER TABLE "upgrade_required_research" DROP CONSTRAINT "upgrade_required_research_research_id_research_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrade_required_research" ADD CONSTRAINT "upgrade_required_research_required_id_research_id_fk" FOREIGN KEY ("required_id") REFERENCES "public"."research"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "upgrade_required_research" DROP CONSTRAINT upgrade_required_research_upgrade_id_research_id_pk;
--> statement-breakpoint
ALTER TABLE "upgrade_required_research" ADD CONSTRAINT upgrade_required_research_upgrade_id_research_id_pk PRIMARY KEY(upgrade_id,required_id);