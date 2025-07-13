-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "planStartDate" TIMESTAMP(3) NOT NULL,
    "planEndDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "userId" TEXT NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadMapItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduleTime" TEXT NOT NULL,
    "actualTime" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "roadMapId" TEXT NOT NULL,

    CONSTRAINT "RoadMapItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadMap" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "planStartDate" TIMESTAMP(3) NOT NULL,
    "planEndDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "goalId" TEXT NOT NULL,

    CONSTRAINT "RoadMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

-- CreateIndex
CREATE INDEX "RoadMapItem_roadMapId_idx" ON "RoadMapItem"("roadMapId");

-- CreateIndex
CREATE INDEX "RoadMap_goalId_idx" ON "RoadMap"("goalId");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadMapItem" ADD CONSTRAINT "RoadMapItem_roadMapId_fkey" FOREIGN KEY ("roadMapId") REFERENCES "RoadMap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadMap" ADD CONSTRAINT "RoadMap_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
