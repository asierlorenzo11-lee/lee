-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthYear" INTEGER,
    "deathYear" INTEGER,
    "country" TEXT,
    "era" TEXT,
    "bio" TEXT NOT NULL,
    "portraitUrl" TEXT
);

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "translatedTitle" TEXT,
    "year" INTEGER,
    "era" TEXT,
    "genre" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Work_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Fragment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "featuredDate" DATETIME,
    "audioUrl" TEXT,
    "artworkImageUrl" TEXT,
    "artworkTitle" TEXT,
    "artworkAuthor" TEXT,
    "artworkCaption" TEXT,
    "workId" TEXT NOT NULL,
    CONSTRAINT "Fragment_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Constellation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ItineraryFragment" (
    "itineraryId" TEXT NOT NULL,
    "fragmentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("itineraryId", "fragmentId"),
    CONSTRAINT "ItineraryFragment_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ItineraryFragment_fragmentId_fkey" FOREIGN KEY ("fragmentId") REFERENCES "Fragment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Annotation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fragmentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "anchorStart" INTEGER,
    "anchorEnd" INTEGER,
    "category" TEXT,
    "questionGroup" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "linkType" TEXT,
    "linkTargetFragmentId" TEXT,
    "externalUrl" TEXT,
    "externalCitation" TEXT,
    CONSTRAINT "Annotation_fragmentId_fkey" FOREIGN KEY ("fragmentId") REFERENCES "Fragment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Annotation_linkTargetFragmentId_fkey" FOREIGN KEY ("linkTargetFragmentId") REFERENCES "Fragment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FragmentTopics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FragmentTopics_A_fkey" FOREIGN KEY ("A") REFERENCES "Fragment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FragmentTopics_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FragmentPlaces" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FragmentPlaces_A_fkey" FOREIGN KEY ("A") REFERENCES "Fragment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FragmentPlaces_B_fkey" FOREIGN KEY ("B") REFERENCES "Place" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FragmentConstellations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FragmentConstellations_A_fkey" FOREIGN KEY ("A") REFERENCES "Constellation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FragmentConstellations_B_fkey" FOREIGN KEY ("B") REFERENCES "Fragment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FragmentCharacters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FragmentCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FragmentCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "Fragment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Work_slug_key" ON "Work"("slug");

-- CreateIndex
CREATE INDEX "Work_authorId_idx" ON "Work"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Fragment_slug_key" ON "Fragment"("slug");

-- CreateIndex
CREATE INDEX "Fragment_workId_idx" ON "Fragment"("workId");

-- CreateIndex
CREATE INDEX "Fragment_status_idx" ON "Fragment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Constellation_slug_key" ON "Constellation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Character_slug_key" ON "Character"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_slug_key" ON "Topic"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Place_slug_key" ON "Place"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_slug_key" ON "Itinerary"("slug");

-- CreateIndex
CREATE INDEX "ItineraryFragment_fragmentId_idx" ON "ItineraryFragment"("fragmentId");

-- CreateIndex
CREATE INDEX "Annotation_fragmentId_idx" ON "Annotation"("fragmentId");

-- CreateIndex
CREATE INDEX "Annotation_type_idx" ON "Annotation"("type");

-- CreateIndex
CREATE UNIQUE INDEX "_FragmentTopics_AB_unique" ON "_FragmentTopics"("A", "B");

-- CreateIndex
CREATE INDEX "_FragmentTopics_B_index" ON "_FragmentTopics"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FragmentPlaces_AB_unique" ON "_FragmentPlaces"("A", "B");

-- CreateIndex
CREATE INDEX "_FragmentPlaces_B_index" ON "_FragmentPlaces"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FragmentConstellations_AB_unique" ON "_FragmentConstellations"("A", "B");

-- CreateIndex
CREATE INDEX "_FragmentConstellations_B_index" ON "_FragmentConstellations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FragmentCharacters_AB_unique" ON "_FragmentCharacters"("A", "B");

-- CreateIndex
CREATE INDEX "_FragmentCharacters_B_index" ON "_FragmentCharacters"("B");
