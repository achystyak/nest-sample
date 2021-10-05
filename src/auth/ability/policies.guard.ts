// import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, SetMetadata } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { GqlExecutionContext } from '@nestjs/graphql';
// import { UserService } from 'src/api/user/user.service';
// import { User } from 'src/api/user/user.type';
// import { AuthService } from '../auth.service';
// import { AppAbility, AbilityFactory } from './ability.factory';

// interface IPolicyHandler {
//     handle(ability: AppAbility): boolean;
// }

// type PolicyHandlerCallback = (ability: AppAbility) => boolean;
// type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

// export const CHECK_POLICIES_KEY = 'check_policy'
// export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers)

// @Injectable()
// export class PoliciesGuard implements CanActivate {
//     constructor(
//         private reflector: Reflector,
//         @Inject(forwardRef(() => AuthService)) private authService: AuthService,
//         @Inject(forwardRef(() => UserService)) private userService: UserService,
//         @Inject(forwardRef(() => AbilityFactory)) private abilityFactory: AbilityFactory,
//     ) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const policyHandlers = this.reflector.get<PolicyHandler[]>(
//             CHECK_POLICIES_KEY,
//             context.getHandler(),
//         )
//         if (!policyHandlers?.length) {
//             return true
//         }

//         const request = context.switchToHttp().getRequest()
//             ?? GqlExecutionContext.create(context).getContext().req

//         const auth = request?.headers?.authorization
//         const user = auth && await this.authService.jwtUser(auth)
//         const ability = user && await this.abilityFactory.createForUser(User.from(user))

//         return ability && policyHandlers.every(handler => this.execPolicyHandler(handler, ability))
//     }

//     private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
//         if (typeof handler === 'function') {
//             return handler(ability)
//         }
//         return handler.handle(ability)
//     }
// }