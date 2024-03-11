import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Prisma, Notification as PrismaNotification } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(notification: PrismaNotification): Notification {
    return Notification.create(
      {
        readAt: notification.readAt,
        recipientId: new UniqueEntityID(notification.recipientId),
        title: notification.title,
        content: notification.content,
        createdAt: notification.createdAt,
      },
      new UniqueEntityID(notification.id),
    )
  }

  static toPersistence(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      readAt: notification.readAt,
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
    }
  }
}
