import { Injectable, EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Observable, from, map, shareReplay, switchMap, tap } from 'rxjs';

export interface YogaClass {
  id: string;
  title: string;
  teacherId?: string;
  classLength: number;
  description: string;
  difficulty: string;
  videoLink: string;
  yogaStyle: string;
  teacherName?: string;
  yogaStyleColor?: string;

}

export interface YogaStyle {
  id: string;
  description: string;
  yogaImg: string;
  yogaImgHover: string;
  headerBackgroundImage: string;
  headerBackgroundColor: string;
  classesBodyBackgroundColor: string;

}

export interface YogaTeacher {
  teacherId?: string;
  ContactName?: string;
  address?: string;
  approved?: boolean;
  bankVerified?: boolean;
  company?: string;
  country?: string;
  email?: string;
  message?: string;
  website?: string;
  yogaStyle?: string;

}

type YogaStyleId = 'hatha' | 'vinyasa' | 'ashtanga' | 'all';

const STYLE_THEME: Record<YogaStyleId, Omit<YogaStyle, 'id' | 'description' | 'yogaImg' | 'yogaImgHover' | 'headerBackgroundImage'>> = {
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
export class YogaService {
  private yogaStyles$?: Observable<YogaStyle[]>;
  private yogaClasses$?: Observable<YogaClass[]>;
  private yogaTeachers$?: Observable<YogaTeacher[]>;
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(EnvironmentInjector);

  constructor() {
    this.yogaTeachers$ = this.getTeachers();
  }
  
  getYogaStyles(): Observable<YogaStyle[]> {
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
          const data = doc.data() as Partial<YogaStyle>;
          const styleId = (data.id ?? doc.id).toLowerCase();
          return {
            ...(data as Omit<YogaStyle, 'id'>),
            id: styleId,
            yogaImg: `/assets/images/${styleId}1.png`,
            yogaImgHover: `/assets/images/${styleId}2.png`,
            headerBackgroundImage: `url('/assets/images/${styleId}-background.png')`
          } as YogaStyle;
        })
      ),
    );

    return this.yogaStyles$;
  }

  getYogaStyle(id: string | null): Observable<YogaStyle> {
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

  getClasses(): Observable<YogaClass[]> {
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
          const data = doc.data() as Partial<YogaClass>;
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
          } as YogaClass;
        })
      ),


      switchMap((classes) =>
        this.getTeachers().pipe(
          map((teachers) => {
            const teachersById = new Map(
              teachers.map((teacher) => [teacher.teacherId, teacher.ContactName] as const)
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

  getFilteredClasses(yogaStyle: string, difficulty: string | null, duration: number | null): Observable<YogaClass[]> {
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
          const data = doc.data() as Partial<YogaTeacher>;
          return {
            teacherId: data.teacherId ?? doc.id,
            ContactName: data.ContactName,
            address: data.address,
            approved: data.approved,
            bankVerified: data.bankVerified,
            company: data.company,
            country: data.country,
            email: data.email,
            message: data.message,
            website: data.website,
            yogaStyle: data.yogaStyle
          } as YogaTeacher;
        })
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    return this.yogaTeachers$;
  }

  

  
}
