import { supabase } from "@/integrations/supabase/client";

export interface AuditEvent {
  event_type: string;
  user_id?: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

class AuditService {
  async logEvent(event: AuditEvent) {
    try {
      // For now, we'll log to browser console and notifications table
      // In production, this would go to a dedicated audit table
      console.log('Audit Event:', {
        timestamp: new Date().toISOString(),
        ...event
      });

      // Log security-related events as notifications for now
      if (this.isSecurityEvent(event.event_type)) {
        await this.logSecurityEvent(event);
      }

    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  private isSecurityEvent(eventType: string): boolean {
    const securityEvents = [
      'account_deletion',
      'auth_failure',
      'password_change',
      'profile_update',
      'team_creation',
      'data_export'
    ];
    return securityEvents.includes(eventType);
  }

  private async logSecurityEvent(event: AuditEvent) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && event.user_id === user.id) {
        await supabase.from('notifications').insert({
          user_id: user.id,
          related_to: 'security',
          message: this.getSecurityMessage(event.event_type),
          metadata: {
            event_type: event.event_type,
            resource_type: event.resource_type,
            resource_id: event.resource_id,
            timestamp: new Date().toISOString()
          } as any
        });
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private getSecurityMessage(eventType: string): string {
    const messages = {
      account_deletion: 'Your account was successfully deleted',
      auth_failure: 'Failed login attempt detected',
      password_change: 'Your password was changed',
      profile_update: 'Your profile was updated',
      team_creation: 'You created a new team',
      data_export: 'Your data was exported'
    };
    return messages[eventType as keyof typeof messages] || 'Security event logged';
  }

  // Specific audit methods for common events
  async logAccountDeletion(userId: string) {
    await this.logEvent({
      event_type: 'account_deletion',
      user_id: userId,
      resource_type: 'user_account',
      resource_id: userId,
      details: { action: 'complete_deletion' }
    });
  }

  async logProfileUpdate(userId: string, changes: Record<string, any>) {
    await this.logEvent({
      event_type: 'profile_update',
      user_id: userId,
      resource_type: 'user_profile',
      resource_id: userId,
      details: { changed_fields: Object.keys(changes) }
    });
  }

  async logTeamCreation(userId: string, teamId: string, teamName: string) {
    await this.logEvent({
      event_type: 'team_creation',
      user_id: userId,
      resource_type: 'team',
      resource_id: teamId,
      details: { team_name: teamName }
    });
  }

  async logAuthFailure(details: Record<string, any>) {
    await this.logEvent({
      event_type: 'auth_failure',
      resource_type: 'authentication',
      details
    });
  }
}

export const auditService = new AuditService();