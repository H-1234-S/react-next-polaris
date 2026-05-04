import { ProjectIdView } from "@/features/projects/views/project-id-view"
import { Id } from "../../../../convex/_generated/dataModel"

export default async function Page({
    params
}: {
    params: Promise<{ projectId: Id<'projects'> }>
}) {

    const { projectId } = await params

    return (
        <ProjectIdView projectId={projectId} />
    )
}