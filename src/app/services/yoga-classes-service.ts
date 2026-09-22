import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, collection, deleteDoc, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { Storage, deleteObject, getDownloadURL, listAll, ref, uploadBytes } from '@angular/fire/storage';
import { Observable, firstValueFrom, from, map, merge, of, shareReplay, switchMap, tap } from 'rxjs';
import { YogaClassData } from '../shared/yoga-class-data';
import { yogaStyles } from '../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { YogaTeacher } from '../shared/yoga-teacher-data';
import { LetterData } from '../shared/letter-data';
import { TeacherInvite } from '../shared/teacher-invite-data';
import { AuthService } from './auth-service';
import { YogaStyleDescription } from '../shared/yoga-style-description-data';
import { EmailData } from '../shared/email-data';

export type { YogaClassData };



type YogaStyleId = (typeof yogaStyles)[number] | 'all';

const STYLE_THEME: Record<YogaStyleId, YogaStyleDescription> = {
  hatha: {
    id: 'hatha',
    title: 'Hatha Yoga',
    description: 'a Gentle and traditional yoga practice focused on postures, breathing, and relaxation.',
    innerDescription: 'hatha yoga is a fundamental, generally slow-paced style of yoga that focuses on aligning the body and mind through physical postures (asanas), breathing techniques (pranayama), and meditation. It balances "sun" (ha) and "moon" (tha) energies to increase strength, flexibility, and relaxation. It is highly accessible, making it excellent for beginners.',
    yogaImg: '/assets/images/hatha1.png',
    yogaImgHover: '/assets/images/hatha2.png',
    headerBackgroundImage: "url('/assets/images/hatha-background.png')",
    headerBackgroundColor: '#4456A9',
    classesBodyBackgroundColor: '#EBEBF5',
    defaultSrc: '/assets/images/hatha-main1.png',
    hoverSrc: '/assets/images/hatha-main2.png'
  },
  vinyasa: {
    id: 'vinyasa',
    title: 'Vinyasa Yoga',
    description: 'A dynamic flow of movements synchronized with the breath..',
    innerDescription: 'vinyasa yoga is a dynamic, fluid style that links postures (asanas) together with breath, often called "flow" yoga. It focuses on moving between poses using inhales and exhales, creating a moving meditation that increases heat and strengthens the body, rather than holding static poses',
    yogaImg: '/assets/images/vinyasa1.png',
    yogaImgHover: '/assets/images/vinyasa2.png',
    headerBackgroundImage: "url('/assets/images/vinyasa-background.png')",
    headerBackgroundColor: '#1F6B9A',
    classesBodyBackgroundColor: '#DEE8F2',
    defaultSrc: '/assets/images/vinyasa-main1.png',
    hoverSrc: '/assets/images/vinyasa-main2.png'
  },
  ashtanga: {
    id: 'ashtanga',
    title: 'Ashtanga Yoga',
    description: 'A structured and energetic yoga practice based on fixed sequences of postures.',
    innerDescription: 'The foundation of most modern yoga practices. It is typically practiced at a slower pace, focusing on physical postures (asanas) and breathing techniques. It’s perfect for beginners or those looking to find balance and relaxation.',
    yogaImg: '/assets/images/ashtanga1.png',
    yogaImgHover: '/assets/images/ashtanga2.png',
    headerBackgroundImage: "url('/assets/images/ashtanga-background.png')",
    headerBackgroundColor: '#61619E',
    classesBodyBackgroundColor: '#E7E7F5',
    defaultSrc: '/assets/images/ashtanga-main1.png',
    hoverSrc: '/assets/images/ashtanga-main2.png'
  },
  all: {
    id: 'all',
    title: 'All Yoga Classes',
    description: 'Welcome to all our yoga styles classes in one place',
    innerDescription: 'Select videos from different yoga styles. Filter videos with style, difficulty and duration. Select several videos to choose from selected videos tab.',
    yogaImg: '/assets/images/all1.png',
    yogaImgHover: '/assets/images/all2.png',
    headerBackgroundImage: "url('/assets/images/all-background.png')",
    headerBackgroundColor: '#3A559A',
    classesBodyBackgroundColor: '#DEE8F2',
    defaultSrc: '/assets/images/all-main1.png',
    hoverSrc: '/assets/images/all-main2.png'
  },
  beyond: {
    id: 'beyond',
    title: 'Beyond Practice',
    description: 'links to yoga philosophy history, and enriching knowledge',
    innerDescription: 'Dive deeper and explore timeless, worldwide wisdom gathered here for you from across the web. Enrich your knowledge and spirit by linking to the philosophy of yoga, its history, and profound wisdom. Discover curated insights that bring a wider meaning to your practice.',
    yogaImg: '/assets/images/beyond1.png',
    yogaImgHover: '/assets/images/beyond2.png',
    headerBackgroundImage: "url('/assets/images/beyond-background.png')",
    headerBackgroundColor: '#3A559A',
    classesBodyBackgroundColor: '#DEE8F2',
    defaultSrc: '/assets/images/beyond-main1.png',
    hoverSrc: '/assets/images/beyond-main2.png'
  }
};

const EMPTY_YOGA_CLASS: YogaClassData = {
  id: '',
  title: '',
  classLength: '',
  description: '',
  difficulty: '',
  videoLink: '',
  yogaStyle: '',
  approved: false
};

@Injectable({
  providedIn: 'root',
})

export class YogaClassesService {

  private yogaStyles$?: Observable<YogaStyleDescription[]>;
  private yogaClasses$?: Observable<YogaClassData[]>;
  private yogaTeachers$?: Observable<YogaTeacher[]>;
  private letters$?: Observable<LetterData[]>;
  private emails$?: Observable<EmailData[]>;
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);
  private readonly injector = inject(EnvironmentInjector);
  private authService = inject(AuthService);

  constructor() {
    this.yogaTeachers$ = this.getTeachers();
  }

  getYogaStyles(): Observable<YogaStyleDescription[]> {
    if (this.yogaStyles$) {
      return this.yogaStyles$;
    }

    this.yogaStyles$ = of(Object.values(STYLE_THEME));
    return this.yogaStyles$;
  }

  getYogaStyle(id: string | null): Observable<YogaStyleDescription> {
    //console.log('page - ' + id )
    const styleId = (id ?? 'all').toLowerCase();
    const theme = STYLE_THEME[(styleId as YogaStyleId)];
    return this.getYogaStyles().pipe(
      map((styles) => {
        const found = styles.find((style) => style.id === styleId);

        if (!found) {
          return {
            id: styleId,
            title: theme.title,
            description: '',
            innerDescription: '',
            yogaImg: `/assets/images/${styleId}1.png`,
            yogaImgHover: `/assets/images/${styleId}2.png`,
            headerBackgroundImage: `url('/assets/images/${styleId}-background.png')`,
            classesBodyBackgroundColor: theme.classesBodyBackgroundColor,
            headerBackgroundColor: theme.headerBackgroundColor,
            defaultSrc: theme.defaultSrc,
            hoverSrc: theme.hoverSrc
          };
        }

        return {
          ...found,
        };
      })
    );
  }

  getClasses(): Observable<YogaClassData[]> {
    if (this.yogaClasses$) {
      return this.yogaClasses$;
    }

    this.yogaClasses$ = from(
      runInInjectionContext(this.injector, () => {
        const classesRef = collection(this.firestore, 'videos');
        return getDocs(classesRef);
      })
    ).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data() as Partial<YogaClassData>;
          const rawCreateDate = (data as { createDate?: Date | { toDate: () => Date } }).createDate;
          const theme = STYLE_THEME[(data.yogaStyle?.toLowerCase() as YogaStyleId)];
          return {
            id: data.id ?? doc.id,
            title: data.title ?? '',
            teacherId: data.teacherId,
            classLength: data.classLength,
            description: data.description,
            difficulty: data.difficulty,
            videoLink: data.videoLink,
            yogaStyle: data.yogaStyle,
            approved: data.approved,
            createDate: rawCreateDate instanceof Date ? rawCreateDate : rawCreateDate?.toDate(),
            yogaStyleColor: theme?.headerBackgroundColor
          } as YogaClassData;
        })
      ),


      switchMap((classes) =>
        this.getTeachers().pipe(
          map((teachers) => {
            const teachersById = new Map(
              teachers.map((teacher) => [teacher.teacherID, teacher.fullName] as const)
            );

            return classes.map((yogaClass) => ({
              ...yogaClass,
              teacherName: yogaClass.teacherId
                ? (teachersById.get(yogaClass.teacherId) ?? '')
                : ''
            }));
          })
        )
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.yogaClasses$;
  }

  getClassesByTeacherID(teacherID: string | undefined): Observable<YogaClassData[]> {
    return this.getClasses().pipe(
      map((classes) =>
        classes.filter((yogaClass) => yogaClass.teacherId === teacherID)
      )
    );
  }

  getClassByID(classId: string | undefined): Observable<YogaClassData | undefined> {

    if (classId == '') {
      return of(EMPTY_YOGA_CLASS);

    }
    return this.getClasses().pipe(
      map((classes) => classes.find((yogaClass) => yogaClass.id === classId))
    );
  }

  getClassByIDs(classesIds: string[]): Observable<YogaClassData[]> {
    const filteredIds = classesIds.filter((id) => !!id);

    if (filteredIds.length === 0) {
      return of([]);
    }

    return this.getClasses().pipe(
      map((classes) => {
        const classMap = new Map(
          classes.map((yogaClass) => [yogaClass.id, yogaClass] as const)
        );

        return filteredIds
          .map((id) => classMap.get(id))
          .filter((yogaClass): yogaClass is YogaClassData => !!yogaClass);
      })
    );
  }


  getFilteredClasses(yogaStyle: string, difficulty: string | null, duration: string | null): Observable<YogaClassData[]> {
    const normalizedStyle = yogaStyle.trim().toLowerCase();
    const normalizedDifficulty = difficulty?.trim().toLowerCase();

    return this.getClasses().pipe(
      map((classes) =>
        classes.filter((yogaClass) => {
          const approved = yogaClass.approved;
          const classStyle = yogaClass.yogaStyle;
          const classDifficulty = yogaClass.difficulty?.toLowerCase() ?? '';

          const matchesStyle = !normalizedStyle || normalizedStyle === 'all' || classStyle === normalizedStyle;
          const matchesDifficulty = !normalizedDifficulty || classDifficulty === normalizedDifficulty;
          const matchesDuration = !duration || yogaClass.classLength === duration;

          return matchesStyle && matchesDifficulty && matchesDuration && approved;
        })
      )
    );
  }

  async saveClass(yogaClass: YogaClassData, videoFile?: File | null): Promise<void> {

    const videoDocRef = yogaClass.id
      ? doc(this.firestore, `videos/${yogaClass.id}`)
      : doc(collection(this.firestore, 'videos'));

    const videoId = videoDocRef.id;

    if (yogaClass.videoLink == '') {
      const videoRef = ref(this.storage, `class-videos/${videoId}/${yogaClass.title}`);
      if (videoFile) {
        await uploadBytes(videoRef, videoFile);
        yogaClass.videoLink = await getDownloadURL(videoRef);
      }
    }

    await setDoc(videoDocRef, {
      ...yogaClass,
      id: videoId
    });

    this.yogaClasses$ = undefined;
    this.yogaClasses$ = this.getClasses();
  }

  async deleteYogaClass(yogaClass: YogaClassData): Promise<void> {
    if (yogaClass.id == '') {
      return;
    }

    const videoLink = yogaClass?.videoLink?.trim();

    if (videoLink) {
      try {
        await deleteObject(ref(this.storage, videoLink));
      } catch (error: unknown) {
        const storageErrorCode = (error as { code?: string }).code;
        if (storageErrorCode !== 'storage/object-not-found') {
          throw error;
        }
      }
    }

    //console.log(JSON.stringify(this.yogaClasses$, null, 2));  
    await deleteDoc(doc(this.firestore, `videos/${yogaClass.id}`));

    this.yogaClasses$ = undefined;
    this.yogaClasses$ = this.getClasses();
  }

  getTeachers(): Observable<YogaTeacher[]> {
    if (this.yogaTeachers$) {
      return this.yogaTeachers$;
    }

    this.yogaTeachers$ = from(
      runInInjectionContext(this.injector, () => {
        const teachersRef = collection(this.firestore, 'teachers');
        //console.log('teachersRef - ' + JSON.stringify(teachersRef));
        return getDocs(teachersRef);
      })
    ).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data() as YogaTeacher;


          return {
            fullName: data.fullName,
            yogaStyle: data.yogaStyle,
            email: data.email,
            website: data.website,
            country: data.country,
            teacherID: data.teacherID,
            status: data.status,
            photo: data.photo,
            description: data.description,
            approved: data.approved
          } as YogaTeacher;
        })
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.yogaTeachers$;
  }


  getTeacher(id: string | undefined): Observable<YogaTeacher> {
    return this.getTeachers().pipe(
      map((teachers) => {
        const found = teachers.find((teacher) => teacher.teacherID === id);
        return found ?? {
          fullName: '',
          yogaStyle: [],
          email: '',
          website: '',
          country: '',
          teacherID: id ?? '',
          photo: '',
          description: '',
          status: 'invited',
          approved: false
        };
      })
    );
  }

  getTeacherInvites(): Observable<TeacherInvite[]> {
    return from(
      runInInjectionContext(this.injector, () => {
        const invitesRef = collection(this.firestore, 'teacherInvites');
        return getDocs(invitesRef);
      })
    ).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data() as TeacherInvite;

          return {
            id: data.id || doc.id,
            email: data.email ?? '',
            name: data.name ?? '',
            website: data.website ?? '',
            invitedAt: data.invitedAt ?? new Date(),
            invitedBy: data.invitedBy ?? '',
            status: data.status ?? ''
          } as TeacherInvite;
        })
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  getTeacherNamesAndIds(): Observable<Array<{ name: string; email: string }>> {
    return this.getTeachers().pipe(
      switchMap((teachers) =>
        this.getTeacherInvites().pipe(
          map((invites) => {
            const teacherNamesAndIds = teachers
              .map((teacher) => ({
                name: teacher.fullName ?? '',
                email: teacher.email ?? ''
              }))
              .filter((teacher) => teacher.name && teacher.email);

            const inviteNamesAndIds = invites
              .map((invite) => ({
                name: invite.name ?? '',
                email: invite.email ?? ''
              }))
              .filter((invite) => invite.name && invite.email);

            return [...teacherNamesAndIds, ...inviteNamesAndIds];
          })
        )
      )
    );
  }

  getTeacherStatus(teacherID: string): Observable<string> {
    return this.getTeacher(teacherID).pipe(
      map((teacher) => (teacher.status ?? ''))
    );
  }

  async saveTeacher(teacher: YogaTeacher, photoFile?: File | null): Promise<void> {
    const teacherID = teacher.teacherID.trim();

    let photoUrl = teacher.photo ?? '';

    if (photoFile && teacher.photo == '') {
      const storageRef = ref(this.storage, `teachers/${teacherID}/photo`);

      await runInInjectionContext(this.injector, () => uploadBytes(storageRef, photoFile));
      photoUrl = await runInInjectionContext(this.injector, () => getDownloadURL(storageRef));
    }

    const teacherToSave: YogaTeacher = {
      ...teacher,
      teacherID,
      photo: photoUrl
    };

    await runInInjectionContext(this.injector, () =>
      setDoc(doc(this.firestore, `teachers/${teacherID}`), teacherToSave, { merge: true })
    );

    this.yogaTeachers$ = undefined;
    this.yogaTeachers$ = this.getTeachers();
  }


  async saveTeacherInvite(teacher: TeacherInvite): Promise<void> {
    const inviteDocRef = teacher.id
      ? doc(this.firestore, `teacherInvites/${teacher.id}`)
      : doc(collection(this.firestore, 'teacherInvites'));

    const inviteToSave: TeacherInvite = {
      ...teacher,
      id: inviteDocRef.id
    };

    await runInInjectionContext(this.injector, () => setDoc(inviteDocRef, inviteToSave, { merge: true }));
  }

  getLetters(): Observable<LetterData[]> {
    if (this.letters$)
      return this.letters$;

    this.letters$ = from(
      runInInjectionContext(this.injector, () => {
        const letterRef = collection(this.firestore, 'letters');
        // console.log('letterRef - ' + letterRef)
        return getDocs(letterRef);
      })
    ).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data() as LetterData;
          const sentTo = (data.sentTo ?? []).map((recipient) => {
            const rawDate = recipient.date as unknown as {
              toDate?: () => Date;
            } | Date | string;
            const date = rawDate instanceof Date
              ? rawDate
              : typeof rawDate === 'object' && rawDate !== null && rawDate.toDate
                ? rawDate.toDate()
                : rawDate
                  ? new Date(String(rawDate))
                  : new Date();

            return { ...recipient, date };
          });

          //console.log('yoga class - ' + JSON.stringify(data, null, 2));

          return {
            id: data.id || doc.id,
            title: data.title,
            content: data.content,
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            updatedAt: data.updatedAt,
            updatedBy: data.updatedBy,
            showLogo: data.showLogo,
            image: data.image,
            sentTo
          } as LetterData;
        })
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.letters$;
  }

  getLetter(letterID: string) {
    return this.getLetters().pipe(
      map((letters) => letters.find((letter) => letter.id === letterID))
    );
  }

  async saveLetter(letter: LetterData): Promise<void> {
    const letterDocRef = letter.id
      ? doc(this.firestore, `letters/${letter.id}`)
      : doc(collection(this.firestore, 'letters'));

    //console.log('letter.recipients - ' + JSON.stringify(letter.recipients))

    const letterToSave: LetterData = {
      ...letter,
      id: letter.id || letterDocRef.id,
      title: letter.title?.trim() ?? '',
      content: letter.content ?? '',
      createdAt: letter.createdAt ?? new Date(),
      createdBy: letter.createdBy ?? '',
      updatedAt: new Date(),
      updatedBy: letter.updatedBy ?? '',
      image: letter.image ?? '',
      showLogo: !!letter.showLogo,
    };

    await runInInjectionContext(this.injector, () =>
      setDoc(letterDocRef, letterToSave, { merge: true })
    );

    this.letters$ = undefined;
    this.letters$ = this.getLetters();
  }

  async sendEmail(email: EmailData): Promise<void> {
    try {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const endpoint = isLocal
        ? "http://127.0.0.1:5001/yoga-app-a3585/us-central1/sendEmail"
        : "https://us-central1-yoga-app-a3585.cloudfunctions.net/sendEmail";

      const idToken = this.authService.getUserID();

      if (!idToken) {
        throw new Error("No authentication token available");
      }

      if (!email.recipients || email.recipients.length === 0) {
        throw new Error("No recipients specified for letter");
      }

      const payload = {
        recipients: email.recipients,
        title: email.title?.trim() || "Untitled",
        content: email.content,
      };
      console.log('payload - ' + JSON.stringify(payload))

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to send email`);
      }

      console.log("Letter sent successfully:", email.id);
    } catch (error) {
      console.error("Error sending letter:", error);
      throw error;
    }
  }

  getEmails(): Observable<EmailData[]> {
    if (this.emails$)
      return this.emails$;

    this.emails$ = from(
      runInInjectionContext(this.injector, () => {
        const emailRef = collection(this.firestore, 'emails');
        return getDocs(emailRef);
      })
    ).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data();
          const rawRecipients = data['recipients'];
          const recipients = (Array.isArray(rawRecipients)
            ? rawRecipients
            : rawRecipients
              ? [rawRecipients]
              : [])
            .map((recipient) => typeof recipient === 'string'
              ? recipient
              : recipient?.email ?? '')
            .filter((recipient) => recipient !== '');
          const rawUpdatedAt = data['updatedAt'] ?? data['created_at'];
          const updatedAt = rawUpdatedAt && typeof rawUpdatedAt === 'object' &&
            typeof rawUpdatedAt.toDate === 'function'
            ? rawUpdatedAt.toDate()
            : rawUpdatedAt instanceof Date
              ? rawUpdatedAt
              : rawUpdatedAt
                ? new Date(String(rawUpdatedAt))
                : new Date();

          //console.log(JSON.stringify(data['recipients']))

          return {
            id: doc.id,
            title: data['subject'] ?? '',
            content: data['text'] ?? '',
            updatedAt,
            updatedBy: data['updatedBy'] ?? '',
            image: data['image'] ?? '',
            showLogo: data['showLogo'] === true,
            read: data['read'] === true,
            from: data['from'] ?? '',
            recipients,
          } as EmailData;
        })
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.emails$;
  }

  getEmail(emailID: string): Observable<EmailData | undefined> {
    return this.getEmails().pipe(
      map((emails) => emails.find((email) => email.id === emailID))
    );
  }

  async saveEmail(email: EmailData): Promise<void> {
    const emailDocRef = email.id
      ? doc(this.firestore, `emails/${email.id}`)
      : doc(collection(this.firestore, 'emails'));

    email.id = emailDocRef.id;
    email.read = true;

    const emailToSave = {
      subject: email.title ?? '',
      text: email.content ?? '',
      created_at: email.updatedAt ?? new Date(),
      updatedAt: email.updatedAt ?? new Date(),
      updatedBy: this.authService.getUserID(),
      from: email.from || email.recipients?.[0] || 'support@yoga-om-line.com',
      recipients: email.recipients,
      read: !!email.read,
    };

    //console.log('emailToSave - ' + JSON.stringify(emailToSave));

    await runInInjectionContext(this.injector, () =>
      setDoc(emailDocRef, emailToSave, { merge: true })
    );

    this.emails$ = undefined;
    this.emails$ = this.getEmails();
  }

  getStorageFiles(): Observable<string[]> {
    return from(
      runInInjectionContext(this.injector, () => listAll(ref(this.storage, 'Files')))
    ).pipe(
      map((result) => result.items.map((item) => item.name)),
      // tap((images) => console.log("images - " + JSON.stringify(images)))
    );
  }

  getStorageFile(selectedOption: string): Observable<string> {
    if (!selectedOption?.trim()) {
      return of('');
    }

    return from(
      runInInjectionContext(this.injector, () =>
        getDownloadURL(ref(this.storage, `Files/${selectedOption.trim()}`))
      )
    );
  }

}
