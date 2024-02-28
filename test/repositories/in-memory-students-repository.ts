import { DomainEvents } from '@/core/events/domain-events'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentRepository {
  public items: Student[] = []

  async findByEmail(email: string): Promise<Student | null> {
    return this.items.find((student) => student.email === email) ?? null
  }

  async create(student: Student): Promise<void> {
    this.items.push(student)

    DomainEvents.dispatchEventsForAggregate(student.id)
  }
}
