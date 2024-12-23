const mongoose = require("mongoose");
const { watchCount } = require("../../controllers/podcastController");
const Schema = mongoose.Schema;

const podcastSchema = new Schema(
  {
    enterpreneur: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    niche: {
      type: String,
      required: true,
    },
    revenue: {
      type: String,
      required: true,
    },
    revenueFrom: {
      type: Number,
      required: true,
    },
    revenueTo: {
      type: Number,
      required: true,
    },
    periodicity: {
      type: String,
      required: true,
    },
    au_depart: {
      type: String,
      required: true,
    },
    au_departFrom: {
      type: Number,
      required: true,
    },
    au_departTo: {
      type: Number,
      required: true,
    },
    employees: {
      type: String,
      required: true,
    },
    employeesFrom: {
      type: Number,
      required: true,
    },
    employeesTo: {
      type: Number,
      required: true,
    },
    idStory: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    podcast: {
      type: String,
      required: true,
      select: false,
    },
    section1: {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    section2: {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    section3: {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    section4: {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    section5: {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    section6: {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      image: {
        type: String,
      },
    },
    locked: {
      type: Boolean,
      default: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    watchCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

podcastSchema.pre("save", async function (next) {
  // unlock the first published podcast
  if (this.isModified("published") && this.published) {
    const podcasts = await Podcast.find({ published: true });
    if (podcasts.length === 0) {
      this.locked = false;
    }
  }
  next();
});

const Podcast = mongoose.model("Podcast", podcastSchema);
module.exports = Podcast;

