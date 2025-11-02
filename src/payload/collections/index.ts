// import collection schemas from payloadcms
import { Categories } from "@/payload/collections/categories/schema";
import { CTA } from "@/payload/collections/cta/schema";
import { FAQ } from "@/payload/collections/faqs/schema";
import { Logos } from "@/payload/collections/logos/schema";
import { Media } from "@/payload/collections/media/schema";
import { Pages } from "@/payload/collections/pages/schema";
import { Posts } from "@/payload/collections/posts/schema";
import { Services } from "@/payload/collections/services/schema";
import { Testimonials } from "@/payload/collections/testimonials/schema";
import { Users } from "@/payload/collections/users/schema";
import { Work } from "@/payload/collections/work/schema";

// central array of all collections for payloadcms registration
const collections = [Pages, Posts, Services, Work, FAQ, CTA, Testimonials, Logos, Categories, Media, Users];

export { collections };
