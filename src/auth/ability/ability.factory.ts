// import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
// import { forwardRef, Inject, Injectable } from "@nestjs/common";
// import { UserService } from "src/api/user/user.service";
// import { User } from "src/api/user/user.type";
// import { AbleType, Action, DomainType } from "src/common/common.enums";
// import { CommentEntity } from "src/database/entities/comment.entity";
// import { EventEntity } from "src/database/entities/event.entity";
// import { EventTypeEntity } from "src/database/entities/event.type.entity";
// import { FormEntity } from "src/database/entities/form.entity";
// import { FormTaskEntity } from "src/database/entities/form.task.entity";
// import { GroupEntity } from "src/database/entities/group.entity";
// import { HeadlineEntity } from "src/database/entities/headline.entity";
// import { InsightViewEntity } from "src/database/entities/insight.view.entity";
// import { NewsArticleEntity } from "src/database/entities/news.article.entity";
// import { NotificationEntity } from "src/database/entities/notification.entity";
// import { PageEntity } from "src/database/entities/page.entity";
// import { PageFieldEntity } from "src/database/entities/page.field.entity";
// import { PageFieldOptionEntity } from "src/database/entities/page.field.option.entity";
// import { PageSchemaEntity } from "src/database/entities/page.schema.entity";
// import { PostEntity } from "src/database/entities/post.entity";
// import { PromptEntity } from "src/database/entities/prompt.entity";
// import { ReadActionEntity } from "src/database/entities/read.action.entity";
// import { ResourceEntity } from "src/database/entities/resource.entity";
// import { RoleEntity } from "src/database/entities/role.entity";
// import { SessionEntity } from "src/database/entities/session.entity";
// import { SnapshotEntity } from "src/database/entities/snapshot.entity";
// import { StoryEntity } from "src/database/entities/story.entity";
// import { TagEntity } from "src/database/entities/tag.entity";
// import { TenantEntity } from "src/database/entities/tenant.entity";
// import { TenantLinkEntity } from "src/database/entities/tenant.link.entity";
// import { TodoEntity } from "src/database/entities/todo.entity";
// import { TodoSubmissionEntity } from "src/database/entities/todo.submission.entity";
// import { UserEntity } from "src/database/entities/user.entity";
// import { UserReactionEntity } from "src/database/entities/user.reaction.entity";

// type AbilitySubjects = InferSubjects<
//     typeof CommentEntity |
//     typeof EventEntity |
//     typeof EventTypeEntity |
//     typeof FormEntity |
//     typeof FormTaskEntity |
//     typeof GroupEntity |
//     typeof HeadlineEntity |
//     typeof InsightViewEntity |
//     typeof NewsArticleEntity |
//     typeof NotificationEntity |
//     typeof PageEntity |
//     typeof PageFieldEntity |
//     typeof PageFieldOptionEntity |
//     typeof PageSchemaEntity |
//     typeof PostEntity |
//     typeof PromptEntity |
//     typeof ReadActionEntity |
//     typeof ResourceEntity |
//     typeof RoleEntity |
//     typeof SessionEntity |
//     typeof SnapshotEntity |
//     typeof StoryEntity |
//     typeof TagEntity |
//     typeof TenantEntity |
//     typeof TenantLinkEntity |
//     typeof TodoEntity |
//     typeof TodoSubmissionEntity |
//     typeof UserEntity |
//     typeof UserReactionEntity
// > | 'all'

// export type AppAbility = Ability<[Action, AbilitySubjects]>

// @Injectable()
// export class AbilityFactory {
//     constructor(
//         @Inject(forwardRef(() => UserService)) private readonly userService: UserService
//     ) { }
//     async createForUser(user: User) {
//         const { can, cannot, build } = new AbilityBuilder<
//             Ability<[Action, AbilitySubjects]>
//         >(Ability as AbilityClass<AppAbility>)
//         if (user.isAdmin) {
//             allActions().map(action => {
//                 can(action, 'all')
//             })
//         } else {
//             const role = await this.userService.role(user)
//             role?.permissions
//                 .filter(permission => permission?.enabled)
//                 .map(permission => {
//                     const EntityType = toSubjectType(permission.domain)
//                     EntityType && permission.actions.map(action => {
//                         if (permission.type == AbleType.Can) {
//                             can(action, EntityType, permission.conditions ?? undefined)
//                         } else if (permission.type == AbleType.Cannot) {
//                             cannot(action, EntityType, permission.conditions ?? undefined)
//                         }
//                     })
//                 })
//         }

//         return build({
//             detectSubjectType: type => type.constructor as ExtractSubjectType<AbilitySubjects>
//         })
//     }
// }

// function toSubjectType(domain: DomainType) {
//     switch (domain) {
//         case DomainType.Comment: return CommentEntity
//         case DomainType.Event: return EventEntity
//         case DomainType.EventType: return EventTypeEntity
//         case DomainType.Form: return FormEntity
//         case DomainType.FormTask: return FormTaskEntity
//         case DomainType.Group: return GroupEntity
//         case DomainType.Headline: return HeadlineEntity
//         case DomainType.InsightView: return InsightViewEntity
//         case DomainType.NewsArticle: return NewsArticleEntity
//         case DomainType.Notification: return NotificationEntity
//         case DomainType.Page: return PageEntity
//         case DomainType.PageField: return PageFieldEntity
//         case DomainType.PageFieldOption: return PageFieldOptionEntity
//         case DomainType.PageSchema: return PageSchemaEntity
//         case DomainType.Post: return PostEntity
//         case DomainType.Prompt: return PromptEntity
//         case DomainType.ReadAction: return ReadActionEntity
//         case DomainType.Resource: return ResourceEntity
//         case DomainType.Role: return RoleEntity
//         case DomainType.Session: return SessionEntity
//         case DomainType.Snapshot: return SnapshotEntity
//         case DomainType.Story: return StoryEntity
//         case DomainType.Tag: return TagEntity
//         case DomainType.Tenant: return TenantEntity
//         case DomainType.TenantLink: return TenantLinkEntity
//         case DomainType.Todo: return TodoEntity
//         case DomainType.TodoSubmission: return TodoSubmissionEntity
//         case DomainType.User: return UserEntity
//         case DomainType.UserReaction: return UserReactionEntity
//     }
// }

// function allActions(): Action[] {
//     return [
//         Action.View,
//         Action.Create,
//         Action.Update,
//         Action.Delete,
//         Action.Schedule,
//         Action.Complete,
//         Action.Archive,
//         Action.Assign,
//         Action.UpdateAssigned,
//         Action.DeleteAssigned,
//         Action.ViewAssigned,
//         Action.CompleteAssigned,
//         Action.ArchiveAssigned,
//     ]
// }
