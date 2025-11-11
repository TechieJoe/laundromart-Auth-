import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";


@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    try {
      // Attempt authentication
      const result = await super.canActivate(context);
      
      if (result) {
        // Manually establish session
        await super.logIn(request);
        
        // For debugging
        console.log('✅ Login successful - User:', request.user);
        console.log('✅ Session established:', request.session);
        
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    response.redirect('/laundromart-app/login?error=Invalid credentials');
    return false;
  }
}

