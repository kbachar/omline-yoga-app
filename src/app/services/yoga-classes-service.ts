import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Observable, from, map, shareReplay, switchMap, tap } from 'rxjs';
import { YogaClassData } from '../shared/yoga-class-data';
import { yogaStyles } from '../shared/yoga-class-details-component/yoga-class-details/yoga-styles-data';
import { YogaTeacher } from '../shared/yoga-teacher-data';

export type { YogaClassData };

export interface YogaStyleDescription {
  id: string;
  description: string;
  yogaImg: string;
  yogaImgHover: string;
  headerBackgroundImage: string;
  headerBackgroundColor: string;
  classesBodyBackgroundColor: string;

}

type YogaStyleId = (typeof yogaStyles)[number] | 'all';

const STYLE_THEME: Record<YogaStyleId, Omit<YogaStyleDescription, 'id' | 'description' | 'yogaImg' | 'yogaImgHover' | 'headerBackgroundImage'>> = {
  hatha: {
    headerBackgroundColor: '#4456A9',
    classesBodyBackgroundColor: '#EBEBF5'
  },
  vinyasa: {
    headerBackgroundColor: '#1F6B9A',
    classesBodyBackgroundColor: '#DEE8F2'
  },
  ashtanga: {
    headerBackgroundColor: '#61619E',
    classesBodyBackgroundColor: '#E7E7F5'
  },
  all: {
    headerBackgroundColor: '#3A559A',
    classesBodyBackgroundColor: '#DEE8F2'
  }
};

@Injectable({
  providedIn: 'root',
})
export class YogaClassesService {
  private yogaStyles$?: Observable<YogaStyleDescription[]>;
  private yogaClasses$?: Observable<YogaClassData[]>;
  private yogaTeachers$?: Observable<YogaTeacher[]>;
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);
  private readonly injector = inject(EnvironmentInjector);

  constructor() {
    this.yogaTeachers$ = this.getTeachers();
  }

  getYogaStyles(): Observable<YogaStyleDescription[]> {
    if (this.yogaStyles$) {
      return this.yogaStyles$;
    }

    this.yogaStyles$ = from(
      runInInjectionContext(this.injector, () => {
        const stylesRef = collection(this.firestore, 'yogaStyles');
        return getDocs(stylesRef);
      })
    ).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data() as Partial<YogaStyleDescription>;
          const styleId = (data.id ?? doc.id).toLowerCase();
          return {
            ...(data as Omit<YogaStyleDescription, 'id'>),
            id: styleId,
            yogaImg: `/assets/images/${styleId}1.png`,
            yogaImgHover: `/assets/images/${styleId}2.png`,
            headerBackgroundImage: `url('/assets/images/${styleId}-background.png')`
          } as YogaStyleDescription;
        })
      ),
    );

    return this.yogaStyles$;
  }

  getYogaStyle(id: string | null): Observable<YogaStyleDescription> {
    const styleId = (id ?? 'all').toLowerCase();
    const theme = STYLE_THEME[(styleId as YogaStyleId)];
    return this.getYogaStyles().pipe(
      map((styles) => {
        const found = styles.find((style) => style.id === styleId);

        if (!found) {
          return {
            id: styleId,
            description: '',
            yogaImg: `/assets/images/${styleId}1.png`,
            yogaImgHover: `/assets/images/${styleId}2.png`,
            headerBackgroundImage: `url('/assets/images/${styleId}-background.png')`,
            classesBodyBackgroundColor: theme.classesBodyBackgroundColor,
            headerBackgroundColor: theme.headerBackgroundColor
          };
        }

        return {
          ...found,
          yogaImg: `/assets/images/${styleId}1.png`,
          yogaImgHover: `/assets/images/${styleId}2.png`,
          headerBackgroundImage: `url('/assets/images/${styleId}-background.png')`,
          classesBodyBackgroundColor: theme.classesBodyBackgroundColor,
          headerBackgroundColor: theme.headerBackgroundColor
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
            yogaStyleColor: theme.headerBackgroundColor
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
    return this.getClasses().pipe(
      map((classes) => classes.find((yogaClass) => yogaClass.id === classId))
    );
  }

  getFilteredClasses(yogaStyle: string, difficulty: string | null, duration: number | null): Observable<YogaClassData[]> {
    const normalizedStyle = yogaStyle.trim().toLowerCase();
    const normalizedDifficulty = difficulty?.trim().toLowerCase();

    return this.getClasses().pipe(
      map((classes) =>
        classes.filter((yogaClass) => {
          const classStyle = yogaClass.yogaStyle?.toLowerCase() ?? '';
          const classDifficulty = yogaClass.difficulty?.toLowerCase() ?? '';

          const matchesStyle = !normalizedStyle || normalizedStyle === 'all' || classStyle === normalizedStyle;
          const matchesDifficulty = !normalizedDifficulty || classDifficulty === normalizedDifficulty;
          const matchesDuration = !duration || yogaClass.classLength === duration;

          return matchesStyle && matchesDifficulty && matchesDuration;
        })
      )
    );
  }

  getTeachers(): Observable<YogaTeacher[]> {
    if (this.yogaTeachers$) {
      return this.yogaTeachers$;
    }

    this.yogaTeachers$ = from(
      runInInjectionContext(this.injector, () => {
        const teachersRef = collection(this.firestore, 'teachers');
        return getDocs(teachersRef);
      })
    ).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data() as YogaTeacher;
          console.log('teacher data:', data);
          return {
            fullName: data.fullName,
            yogaStyle: data.yogaStyle,
            email: data.email,
            website: data.website,
            country: data.country,
            teacherID: data.teacherID,
            status: data.status,
            photo: data.photo,
            description: data.description
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
          fullName: 'Unknown Teacher',
          yogaStyle: [],
          email: '',
          website: '',
          country: '',
          teacherID: id ?? '',
          status: '',
          photo: '',
          description: ''
        };
      })
    );
  }

  getTeacherStatus(teacherID: string): Observable<string> {
    return this.getTeacher(teacherID).pipe(
      map((teacher) => teacher.status ?? '')
    );
  }

  async saveTeacher(teacher: YogaTeacher, photoFile?: File | null): Promise<void> {
    const teacherID = teacher.teacherID.trim();

    if (!teacherID) {
      throw new Error('Teacher ID is required to save teacher details.');
    }

    let photoUrl = teacher.photo ?? '';

    if (photoFile) {
      const storageRef = ref(this.storage, `teachers/${teacherID}/photo`);

      await runInInjectionContext(this.injector, () => uploadBytes(storageRef, photoFile));
      photoUrl = await runInInjectionContext(this.injector, () => getDownloadURL(storageRef));
      console.log(photoUrl)
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
}
